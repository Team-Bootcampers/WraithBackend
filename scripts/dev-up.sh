#!/usr/bin/env bash
# Tüm servisleri tek komutla ayağa kaldırır, auth-service sağlıklı olunca
# Swagger UI'ı (varsa) tarayıcıda otomatik açar.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "→ .env bulunamadı, .env.example kopyalanıyor"
  cp .env.example .env
fi

docker compose up -d --build

SWAGGER_URL="http://auth.localhost/docs"
echo "→ auth-service sağlıklı olması bekleniyor..."

for _ in $(seq 1 30); do
  if curl -sf "$SWAGGER_URL" > /dev/null 2>&1; then
    echo "→ Swagger hazır: $SWAGGER_URL"
    if command -v open > /dev/null 2>&1; then
      open "$SWAGGER_URL"
    elif command -v xdg-open > /dev/null 2>&1; then
      xdg-open "$SWAGGER_URL"
    else
      echo "→ Tarayıcıda şu adresi açın: $SWAGGER_URL"
    fi
    exit 0
  fi
  sleep 2
done

echo "→ Zaman aşımı: servisler henüz hazır değil. 'docker compose logs -f' ile kontrol edin."
echo "→ URL: $SWAGGER_URL"
exit 1
