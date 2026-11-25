#!/usr/bin/env bash
# Build the site and publish it to the gh-pages branch.
#   npm run deploy
# Override the domain if it ever changes:
#   NUXT_PUBLIC_SITE_URL=https://example.com npm run deploy
set -euo pipefail

SITE_URL="${NUXT_PUBLIC_SITE_URL:-https://jyotijabare60.github.io}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "→ building with NUXT_PUBLIC_SITE_URL=$SITE_URL"
NUXT_PUBLIC_SITE_URL="$SITE_URL" npm run generate

[ -f .output/public/index.html ] || { echo "✗ build produced no output — nothing deployed"; exit 1; }

echo "→ preparing the gh-pages worktree"
git fetch origin gh-pages --quiet
rm -rf .deploy
git worktree prune
git worktree add -f --detach .deploy origin/gh-pages --quiet

cd .deploy
git rm -rq . >/dev/null 2>&1 || true
cp -r "$ROOT/.output/public/." .
# Jekyll ignores underscore-prefixed paths, which would drop every /_nuxt/ asset
touch .nojekyll

if git diff --cached --quiet && git diff --quiet && [ -z "$(git status --porcelain)" ]; then
  echo "→ no changes to publish"
else
  git add -A
  git commit -q -m "Deploy site build from main@$(git -C "$ROOT" rev-parse --short HEAD)"
  git push -q origin HEAD:gh-pages
  echo "✓ published to gh-pages"
fi

cd "$ROOT"
git worktree remove --force .deploy
echo "✓ done — https://jyotijabare60.github.io (allow a minute for GitHub to serve it)"
