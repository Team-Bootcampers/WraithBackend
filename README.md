# CoreBackendKit

NestJS tabanlı, Traefik gateway, Firebase Auth, gRPC/NATS ve PostgreSQL & MongoDB kullanan mikroservis backend'i.

## Klasör Yapısı

```
apps/                       Nest CLI monorepo altındaki her bir çalıştırılabilir servis
  gateway/                  ✅ Traefik arkasındaki tek giriş noktası, user-service'i REST+Swagger olarak dışa açar
  auth-service/             ✅ Firebase Auth (signup/login) + kendi Postgres DB'si (login audit)
  user-service/             ✅ Kullanıcı profilleri, gRPC server, kendi Postgres DB'si
  catalog-service/          (henüz yazılmadı) Örnek domain servisi (MongoDB)
  notification-service/     (henüz yazılmadı) Event-driven örnek servis (NATS tüketicisi)

libs/                       Servisler arasında paylaşılan Nest kütüphaneleri (henüz kullanılmıyor,
                             ileride birden fazla servis aynı koda ihtiyaç duyunca buraya taşınacak)

proto/                      gRPC servis sözleşmeleri (.proto)
  user/user.proto           ✅ auth-service (client) ↔ user-service (server)

infra/
  traefik/                  traefik.yml (static) + dynamic/routes.yml (dosya tabanlı routing)
  docker/                   Ortak NestJS Dockerfile (APP_NAME build-arg ile parametrize)

scripts/
  dev-up.sh                 ✅ docker compose up + health-check + Swagger'ı tarayıcıda açar
```

## Auth & User Mikroservisleri (Faz 1)

İki ayrı servis, aralarında **gRPC** ile konuşur, her birinin **kendi Postgres veritabanı** vardır:

- **auth-service** (`apps/auth-service`, HTTP `:3001`, Traefik: `http://api.localhost/auth/**`)
  - `POST /auth/signup` — Firebase Admin SDK ile kullanıcı oluşturur, ardından gRPC ile `user-service`'te profil kaydı açar. `user-service` başarısız olursa Firebase'de sahipsiz hesap kalmasın diye **rollback** yapılır (`deleteUser`).
  - `POST /auth/login` — Firebase Identity Toolkit REST API (`signInWithPassword`) ile giriş yapar, `idToken`/`refreshToken` döner. Her deneme kendi DB'sindeki `login_audit` tablosuna yazılır. `user-service` o an ayakta değilse login **başarısız sayılmaz** (kimlik doğrulama zaten Firebase'de tamamlanmıştır) — sadece profil bilgisi `user: null` döner.
  - Swagger: `http://api.localhost/docs`
  - DB: `auth-postgres` (tablo: `login_audit`)

- **user-service** (`apps/user-service`, sadece gRPC `:5001`, dışa açık değil)
  - `CreateUser`, `GetUserByFirebaseUid`, `GetUserById`, `ListUsers`, `UpdateUser`, `DeleteUser` (soft delete) — TypeORM ile `users` tablosuna yazar/okur.
  - `DeleteUser` kaydı silmez, `isActive` alanını `false` yapar (soft delete). `GetUserById`/`ListUsers` sadece `isActive: true` kullanıcıları döner.
  - DB: `user-postgres` (tablo: `users`)

- **gateway** (`apps/gateway`, HTTP `:3000`, Traefik: `http://api.localhost`)
  - `user-service`'in gRPC uçlarını REST+Swagger olarak dışa açar (dışarıdan gRPC'ye doğrudan erişim yok):
    - `GET /users` — aktif kullanıcıları listeler
    - `GET /users/:id` — kullanıcıyı id ile bulur (soft-deleted ise `404`)
    - `PATCH /users/:id` — `displayName` günceller
    - `DELETE /users/:id` — soft delete (`isActive = false`), `204` döner
  - Swagger: `http://api.localhost/docs`

### Neden Firebase hem Admin SDK hem REST API?
Firebase Admin SDK parola doğrulayamaz (sadece kullanıcı yönetimi yapar); email/parola ile giriş backend üzerinden yapılacaksa Identity Toolkit REST API'sinin (`FIREBASE_API_KEY`) kullanılması gerekir. Bu proje bu deseni izliyor: **signup → Admin SDK**, **login → REST API**.

### Servis izolasyonu
`user-service` durdurulduğunda `auth-service`, `auth-postgres`, `traefik` etkilenmez (test edildi: `docker compose stop user-service` sonrası `/health` hâlâ `200` döndü). Bunun iki nedeni var:
1. Her servis ayrı container + ayrı DB (varsayılan Docker Compose davranışı: bir container durunca diğerleri kapanmaz).
2. `auth-service`, `user-service`'e yapılan gRPC çağrılarını `try/catch` ile sarar; login'de profil sorgusu başarısız olursa sadece uyarı loglanır, istek düşmez.

## Docker Compose

```bash
cp .env.example .env
# .env içine gerçek Firebase Admin SDK service account bilgilerini ve Web API key'i girin
docker compose up --build
# veya: ./scripts/dev-up.sh  (health-check sonrası Swagger'ı otomatik açar)
```

- **traefik**: `:80` üzerinden dış trafiği karşılar. Docker-label auto-discovery yerine **dosya tabanlı routing** (`infra/traefik/dynamic/routes.yml`) kullanılır — `docker.sock`'a erişimin kısıtlı/proxy'li olduğu ortamlarda (bazı sandbox/CI kurulumları) daha taşınabilir. Yeni bir servisi expose etmek için `routes.yml`'e bir router/service bloğu eklenir. Dashboard: `:8080` (dev only, auth'suz).
- **auth-postgres / user-postgres**: birbirinden bağımsız iki Postgres container'ı, ayrı volume ve healthcheck ile.
- **auth-service / user-service**: `infra/docker/Dockerfile` (ortak, `APP_NAME` build-arg'ı ile parametrize) üzerinden build edilir; `proto/` klasörü runtime image'a da kopyalanır (gRPC contract'ı ikisi de kullanır).
- Servisler arası iletişim `backbone` bridge network'ü üzerinden; dışa sadece Traefik açık (DB'ler ve gRPC portu container-internal).
- Tüm servislerde `restart: unless-stopped` — bir servis çökerse otomatik yeniden başlar, diğerlerini etkilemez.

### Firebase kurulumu (gerekli)
1. Firebase Console → Project Settings → **Service accounts** → "Generate new private key" → indirilen JSON'dan `project_id`, `client_email`, `private_key` değerlerini `.env`'e yazın (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).
2. Firebase Console → Project Settings → **General** → "Web API Key" değerini `FIREBASE_API_KEY`'e yazın.
3. Firebase Console → Authentication → Sign-in method → **Email/Password**'ü etkinleştirin.

Bu değerler girilmeden de `docker compose up` sorunsuz çalışır ve Swagger açılır; sadece `/auth/signup` ve `/auth/login` istekleri `503`/`401` döner (servis çökmez).

## Routing Kuralı (Bağlayıcı Mimari Kural)

Bu projede tüm HTTP servisleri dış dünyaya **yalnızca tek bir domain** üzerinden açılır:

| Domain | Kural |
|---|---|
| `api.localhost` | Tüm servisler için tek giriş noktası |
| `*.localhost` (alt domain) | **KULLANILMAZ** — yeni servis eklerse mevcut pattern izlenir |

**Yeni bir HTTP servisi eklerken şu adımlar izlenir:**
1. `infra/traefik/dynamic/routes.yml` dosyasına yeni bir `router` + `service` bloğu eklenir.
   - `rule: "Host('api.localhost') && PathPrefix('/yeni-servis-prefix')"`
2. Servisin `main.ts` dosyasında Swagger `DocumentBuilder`'a `.addServer('http://api.localhost', 'API Gateway (dev)')` eklenir.
3. NestJS controller'da `@Controller('yeni-servis-prefix')` prefix'i Traefik'teki PathPrefix ile eşleştirilir.
4. Swagger: Her servisin `/docs` path'i Traefik üzerinden `api.localhost/docs` adresine yönlendirilir (gateway üzerinden konsolide edilir).

**Mevcut prefix'ler:**

| Prefix | Servis |
|---|---|
| `/auth` | auth-service (HTTP :3001) |
| `/users` | gateway → user-service (gRPC :5001) |

---

## Notlar
- `apps/` yapısı Nest CLI monorepo modunu (`nest-cli.json` içinde `projects`) hedefler.
- `synchronize: true` (TypeORM) sadece dev kolaylığı için; production'a geçerken migration'lara taşınmalı.
- `catalog-service`, `notification-service`, `libs/` klasörleri sonraki fazlar için ayrılmış scaffold — henüz derlenebilir kod içermiyor.
