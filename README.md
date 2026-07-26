# CoreBackendKit

<img width="1512" height="830" alt="image" src="https://github.com/user-attachments/assets/1aa8ea2e-1e1e-494e-b150-8579cea539c2" />

NestJS tabanlı mikroservis backend'i. Tüm dış trafik **Traefik** üzerinden tek bir domain'e (`api.localhost` / prod'da `wraithathon.gokhansal.com`) düşer; servisler birbiriyle **gRPC** ile konuşur, event-driven akışlar için **NATS** planlanmıştır. Her servisin kendi veritabanı vardır: ilişkisel veriler **PostgreSQL** + **TypeORM**, doküman tabanlı veriler için **MongoDB** ayrılmıştır. Kimlik doğrulama Firebase Auth ile yapılır; parola/secret gerektiren senaryolar için **bcrypt** kullanılır.

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | [NestJS](https://nestjs.com) (Nest CLI monorepo, `apps/` altında bağımsız çalıştırılabilir servisler) |
| API Gateway / Reverse Proxy | [Traefik v3](https://traefik.io) — dosya tabanlı routing (`infra/traefik/dynamic/routes.yml`), tek giriş noktası |
| Servisler arası iletişim | [gRPC](https://grpc.io) (`@nestjs/microservices`, `.proto` sözleşmeleri `proto/` altında) |
| Event-driven iletişim | [NATS](https://nats.io) — asenkron/olay tabanlı akışlar için (`libs/nats`, `notification-service`) |
| İlişkisel veritabanı | [PostgreSQL 16](https://www.postgresql.org) + [TypeORM](https://typeorm.io) — her servisin kendi DB'si, kendi container'ı |
| Doküman veritabanı | [MongoDB](https://www.mongodb.com) — şema esnekliği gereken domainler için (`libs/database/mongo`) |
| Kimlik doğrulama | [Firebase Auth](https://firebase.google.com/products/auth) (Admin SDK + Identity Toolkit REST API) |
| Parola/secret hashleme | [bcrypt](https://www.npmjs.com/package/bcrypt) |
| Dokümantasyon | [Swagger / OpenAPI](https://swagger.io) (`@nestjs/swagger`), gateway üzerinden `/docs` altında birleştirilir |
| AI | [Google Gemini](https://ai.google.dev) (`ai-service`, seyahat kişiliği analizi ve rota üretimi) |
| Container / Orkestrasyon | Docker Compose (dev: `docker-compose.yml`, prod: `docker-compose.prod.yml`), ortak `infra/docker/Dockerfile` (`APP_NAME` build-arg ile parametrize) |
| Dış erişim (prod) | Cloudflare Tunnel (`cloudflared`) |

## Klasör Yapısı

```
apps/                       Nest CLI monorepo altındaki her bir çalıştırılabilir servis
  gateway/                  ✅ Traefik arkasındaki tek giriş noktası; tüm servisleri REST+Swagger olarak dışa açar
  auth-service/             ✅ Firebase Auth (signup/login) + kendi Postgres DB'si (login audit)
  user-service/             ✅ Kullanıcı profilleri + onboarding cevapları, gRPC server, kendi Postgres DB'si
  ai-service/                ✅ Gemini ile seyahat kişiliği analizi, rota/otel/restoran/gezilecek yer önerisi, seyahat planlama (stateless, DB'siz)
  hotel-service/             ✅ Otel kataloğu (JSON'dan seed), gRPC server, kendi Postgres DB'si
  restaurant-service/        ✅ Restoran kataloğu (JSON'dan seed), gRPC server, kendi Postgres DB'si
  attraction-service/        ✅ Gezilecek yer kataloğu (JSON'dan seed), gRPC server, kendi Postgres DB'si
  trip-service/              ✅ Kullanıcıların oluşturduğu seyahatler (durak, otel/restoran/gezilecek yer anlık kopyası, oylama), gRPC server, kendi Postgres DB'si
  notification-service/      🚧 Planlanan: event-driven bildirim servisi (NATS tüketicisi, MongoDB) — henüz scaffold

libs/                       Servisler arasında paylaşılan Nest kütüphaneleri
  common/                   Ortak yardımcılar
  config/                   Ortak konfigürasyon
  database/postgres/        Ortak TypeORM/Postgres yardımcıları
  database/mongo/           Ortak MongoDB bağlantı/şema yardımcıları (🚧 henüz kullanılmıyor)
  nats/                     Ortak NATS client/publisher yardımcıları (🚧 henüz kullanılmıyor)
  firebase/                 Firebase Admin SDK yardımcıları
  types/                    Servisler arası paylaşılan TypeScript tipleri

proto/                      gRPC servis sözleşmeleri (.proto)
  user/user.proto           auth-service, gateway (client) ↔ user-service (server)
  hotel/hotel.proto         gateway (client) ↔ hotel-service (server)
  restaurant/restaurant.proto  gateway (client) ↔ restaurant-service (server)
  attraction/attraction.proto  gateway (client) ↔ attraction-service (server)
  trip/trip.proto           gateway (client) ↔ trip-service (server)
  ai/ai.proto                gateway (client) ↔ ai-service (server)
  catalog/                  🚧 planlanan
  notification/             🚧 planlanan

infra/
  traefik/                  traefik.yml (static) + dynamic/routes.yml (dosya tabanlı routing)
  docker/                   Ortak NestJS Dockerfile (APP_NAME build-arg ile parametrize)

scripts/
  dev-up.sh                 docker compose up + health-check + Swagger'ı tarayıcıda açar
```

## Mikroservisler

Tüm gRPC servisleri dışarıya kapalıdır; sadece **gateway** dış dünyaya REST+Swagger olarak açar. Her servisin kendi veritabanı vardır (database-per-service), servisler arası doğrudan DB erişimi yoktur.

| Servis | Protokol / Port | Veritabanı | Sorumluluk |
|---|---|---|---|
| **gateway** | HTTP `:3000` (Traefik: `/`) | — | Tüm gRPC servislerini REST+Swagger olarak dışa açan tek giriş noktası; birleşik `/docs` |
| **auth-service** | HTTP `:3001` (Traefik: `/auth`) | Postgres (`auth_db`, tablo: `login_audit`) | Firebase Admin SDK ile signup, Identity Toolkit REST API ile login, giriş denemesi audit kaydı, `user-service`'e gRPC ile profil oluşturma/rollback |
| **user-service** | gRPC `:5001` | Postgres (`user_db`, tablo: `users`) | Kullanıcı profilleri (CRUD, soft delete), onboarding cevapları (jsonb) |
| **ai-service** | gRPC `:5002` | — (stateless) | Gemini ile seyahat kişiliği analizi, rota üretimi, otel/restoran/gezilecek yer/seyahat önerisi, gün gün seyahat planlama, sürpriz seyahat üretimi |
| **hotel-service** | gRPC `:5003` | Postgres (`hotel_db`) | Otel kataloğu (JSON'dan seed edilmiş veri), ülke/şehir filtreli listeleme |
| **restaurant-service** | gRPC `:5004` | Postgres (`restaurant_db`) | Restoran kataloğu (JSON'dan seed edilmiş veri), ülke/şehir filtreli listeleme |
| **attraction-service** | gRPC `:5005` | Postgres (`attraction_db`) | Gezilecek yer kataloğu (JSON'dan seed edilmiş veri), ülke/şehir filtreli listeleme |
| **trip-service** | gRPC `:5006` | Postgres (`trip_db`) | Kullanıcı seyahatleri: durak bazlı oluşturma (otel/restoran/gezilecek yer anlık kopyası ile), yayınlama, oylama, güncelleme, soft delete |
| **notification-service** 🚧 | planlanan (NATS tüketicisi) | MongoDB (planlanan) | Event-driven bildirimler — henüz scaffold, çalışan kod yok |

### Gateway REST Uçları (özet)

| Prefix | Karşılık geldiği servis |
|---|---|
| `/auth` | auth-service (doğrudan, Traefik üzerinden) |
| `/users` | gateway → user-service (gRPC) |
| `/hotels` | gateway → hotel-service (gRPC) |
| `/restaurants` | gateway → restaurant-service (gRPC) |
| `/attractions` | gateway → attraction-service (gRPC) |
| `/trips` | gateway → trip-service (gRPC) |
| `/ai` | gateway → ai-service (gRPC) |
| `/health` | gateway kendi health-check'i |

Swagger: `https://wraithathon.gokhansal.com/docs` (prod) / `http://api.localhost/docs` (dev)

### Neden Firebase hem Admin SDK hem REST API?
Firebase Admin SDK parola doğrulayamaz (sadece kullanıcı yönetimi yapar); email/parola ile giriş backend üzerinden yapılacaksa Identity Toolkit REST API'sinin (`FIREBASE_API_KEY`) kullanılması gerekir. Bu proje bu deseni izliyor: **signup → Admin SDK**, **login → REST API**.

### Servis izolasyonu
Her servis ayrı container + ayrı DB ile çalışır; bir servis çökse/durursa diğerleri etkilenmez (Docker Compose varsayılan davranışı). `auth-service`, `user-service`'e yapılan gRPC çağrılarını `try/catch` ile sarar; `user-service` ayakta değilse login **başarısız sayılmaz**, sadece profil bilgisi `null` döner.

## Docker Compose ile Çalıştırma

```bash
cp .env.example .env
# .env içine gerçek Firebase Admin SDK service account bilgilerini, Web API key'i ve Gemini API key'ini girin
docker compose up --build
# veya: ./scripts/dev-up.sh  (health-check sonrası Swagger'ı otomatik açar)
```

- **traefik**: `:80` üzerinden dış trafiği karşılar. Docker-label auto-discovery yerine **dosya tabanlı routing** (`infra/traefik/dynamic/routes.yml`) kullanılır — `docker.sock`'a erişimin kısıtlı/proxy'li olduğu ortamlarda (bazı sandbox/CI kurulumları) daha taşınabilir. Yeni bir servisi expose etmek için `routes.yml`'e bir router/service bloğu eklenir. Dashboard: `:8080` (dev only, auth'suz).
- **`<servis>`-postgres**: her domain servisinin (`auth`, `user`, `hotel`, `restaurant`, `attraction`, `trip`) kendi bağımsız Postgres container'ı, ayrı volume ve healthcheck ile.
- Her servis `infra/docker/Dockerfile` (ortak, `APP_NAME` build-arg'ı ile parametrize) üzerinden build edilir; `proto/` klasörü runtime image'a da kopyalanır (gRPC contract'ları tüm ilgili servislerce kullanılır).
- Servisler arası iletişim `backbone` bridge network'ü üzerinden; dışa sadece Traefik açık (DB'ler ve gRPC portları container-internal).
- Tüm servislerde `restart: unless-stopped` — bir servis çökerse otomatik yeniden başlar, diğerlerini etkilemez.
- **cloudflared**: prod ortamda Cloudflare Tunnel üzerinden dış dünyaya açılır (`CLOUDFLARE_TUNNEL_TOKEN`).

### Firebase kurulumu (gerekli)
1. Firebase Console → Project Settings → **Service accounts** → "Generate new private key" → indirilen JSON'dan `project_id`, `client_email`, `private_key` değerlerini `.env`'e yazın (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).
2. Firebase Console → Project Settings → **General** → "Web API Key" değerini `FIREBASE_API_KEY`'e yazın.
3. Firebase Console → Authentication → Sign-in method → **Email/Password**'ü etkinleştirin.

Bu değerler girilmeden de `docker compose up` sorunsuz çalışır ve Swagger açılır; sadece `/auth/signup` ve `/auth/login` istekleri `503`/`401` döner (servis çökmez).

### Gemini kurulumu (ai-service için gerekli)
`GEMINI_API_KEY` ve isteğe bağlı `GEMINI_MODEL` (varsayılan: `gemini-flash-latest`) `.env` içine girilir. Girilmezse `ai-service` uçları hata döner, diğer servisler etkilenmez.

## Routing Kuralı (Bağlayıcı Mimari Kural)

Bu projede tüm HTTP servisleri dış dünyaya **yalnızca tek bir domain** üzerinden açılır:

| Domain | Kural |
|---|---|
| `api.localhost` (dev) / `wraithathon.gokhansal.com` (prod) | Tüm servisler için tek giriş noktası |
| `*.localhost` / `*.gokhansal.com` (alt domain) | **KULLANILMAZ** — yeni servis eklerse mevcut pattern izlenir |

**Yeni bir HTTP servisi eklerken şu adımlar izlenir:**
1. `infra/traefik/dynamic/routes.yml` dosyasına yeni bir `router` + `service` bloğu eklenir.
   - `rule: "Host(\`<domain>\`) && PathPrefix(\`/yeni-servis-prefix\`)"`
2. Servisin `main.ts` dosyasında Swagger `DocumentBuilder`'a `.addServer(...)` eklenir.
3. NestJS controller'da `@Controller('yeni-servis-prefix')` prefix'i Traefik'teki PathPrefix ile eşleştirilir.
4. Swagger: Her servisin `/docs` path'i Traefik üzerinden gateway'de konsolide edilir.

**Yeni bir gRPC servisi eklerken şu adımlar izlenir:**
1. `proto/<domain>/<domain>.proto` dosyası tanımlanır.
2. Servis kendi `apps/<domain>-service` altında gRPC server olarak ayağa kalkar, kendi Postgres/MongoDB DB'sine sahip olur.
3. `gateway`, ilgili `.proto` sözleşmesini gRPC client olarak kullanıp REST+Swagger uçları açar.
4. `docker-compose.yml`'e servis + (gerekiyorsa) DB container'ı ve healthcheck eklenir, `.env.example`'a port/bağlantı değişkenleri eklenir.

---

## Notlar
- `apps/` yapısı Nest CLI monorepo modunu (`nest-cli.json` içinde `projects`) hedefler.
- `synchronize: true` (TypeORM) sadece dev kolaylığı için; production'a geçerken migration'lara taşınmalı.
- `notification-service`, `proto/catalog`, `proto/notification`, `libs/nats`, `libs/database/mongo` sonraki fazlar için ayrılmış scaffold — henüz çalışan kod içermiyor (NATS ve MongoDB entegrasyonu planlanan aşamalar).
