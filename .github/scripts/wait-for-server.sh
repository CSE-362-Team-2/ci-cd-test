#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for server on http://localhost:5000..."

MAX_ATTEMPTS=30
ATTEMPT=1

until curl -s http://localhost:5000/api/posts > /dev/null; do
  if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
    echo "Error: Timed out waiting for Hono Dev Server after ${MAX_ATTEMPTS} seconds."
    exit 1
  fi
  sleep 1
  ATTEMPT=$((ATTEMPT + 1))
done

echo "Dev Server is ready"
