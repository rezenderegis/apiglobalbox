#!/bin/sh
set -e

echo "Aguardando PostgreSQL em $DB_HOST:$DB_PORT..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  sleep 2
done
echo "PostgreSQL disponível."

echo "Executando migrações..."
for file in /app/migrations/*.sql; do
  echo "  -> $file"
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -f "$file"
done
echo "Migrações concluídas."

exec node dist/main
