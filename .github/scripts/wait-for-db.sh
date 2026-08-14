#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for PostgreSQL to accept connections..."

MAX_ATTEMPTS=30
ATTEMPT=1

until docker compose exec -T db pg_isready -U postgres -d myappdb_dev > /dev/null 2>&1; do
  if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
    echo "Error: Timed out waiting for PostgreSQL after ${MAX_ATTEMPTS} seconds."
    exit 1
  fi
  sleep 1
  ATTEMPT=$((ATTEMPT + 1))
done

echo "PostgreSQL is ready"
