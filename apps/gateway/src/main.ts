import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/** Verilen URL'den OpenAPI JSON spec'ini çeker. Başarısız olursa null döner. */
async function fetchSpec(url: string): Promise<OpenAPIObject | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as OpenAPIObject;
  } catch {
    return null;
  }
}

/**
 * `sources` içindeki spec'leri `base` dokümanına birleştirir (paths + schemas + tags).
 * Yeni bir servis eklendiğinde sadece fetchSpec çağrısı ve bu fonksiyona geçirilen
 * argüman eklenmesi yeterli — başka bir dosyaya dokunulmasına gerek yok.
 */
function mergeInto(base: OpenAPIObject, ...sources: (OpenAPIObject | null)[]): void {
  for (const src of sources) {
    if (!src) continue;
    // Paths
    Object.assign(base.paths, src.paths ?? {});
    // Schemas
    base.components ??= {};
    base.components.schemas ??= {};
    Object.assign(base.components.schemas, src.components?.schemas ?? {});
    // Tags (tekrarlanmadan ekle)
    const existing = new Set((base.tags ?? []).map((t) => t.name));
    for (const tag of src.tags ?? []) {
      if (!existing.has(tag.name)) {
        (base.tags ??= []).push(tag);
        existing.add(tag.name);
      }
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ── Gateway'in kendi spec'i (users endpointleri) ──────────────────────────
  const config = new DocumentBuilder()
    .setTitle('CoreBackendKit API')
    .setDescription('Tüm mikroservislerin birleşik API dokümantasyonu')
    .setVersion('0.1.0')
    .addTag('users')
    .addTag('auth')
    .addServer('http://api.localhost', 'API Gateway (dev)')
    .build();

  const mergedDoc = SwaggerModule.createDocument(app, config);

  // ── Diğer servislerin spec'lerini fetch edip birleştir ────────────────────
  // Yeni bir HTTP servis eklendiğinde buraya fetchSpec satırı eklenir.
  const authPort = process.env.AUTH_HTTP_PORT ?? '3001';
  const authSpec = await fetchSpec(`http://auth-service:${authPort}/auth/api-json`);
  if (!authSpec) {
    console.warn('⚠️  auth-service spec fetch edilemedi; auth endpointleri Swagger\'da görünmeyebilir.');
  }

  mergeInto(mergedDoc, authSpec);

  // ── Tek birleşik dokümanı /docs adresinde yayınla ─────────────────────────
  SwaggerModule.setup('docs', app, mergedDoc, {
    jsonDocumentUrl: 'api-json',
  });

  const port = Number(process.env.GATEWAY_HTTP_PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`gateway listening on http://localhost:${port}`);
  console.log(`Swagger docs (birleşik): http://api.localhost/docs`);
}

bootstrap();
