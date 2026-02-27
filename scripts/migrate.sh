#!/usr/bin/env bash
set -euo pipefail

CONTAINER="pg-agent-db"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Waiting for postgres to be ready..."
until docker exec "$CONTAINER" pg_isready -U postgres -q; do
  sleep 1
done

echo "Running migrations inside container..."
docker exec -i "$CONTAINER" psql -U postgres -d pg_agent < "$SCRIPT_DIR/migrate.sql"
echo "Migration complete."
