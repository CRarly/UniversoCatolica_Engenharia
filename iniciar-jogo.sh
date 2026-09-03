#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Instale o Node.js 22 LTS ou superior: https://nodejs.org/"
  exit 1
fi

if [ ! -d node_modules ]; then
  npm install
fi

npm run dev:local
