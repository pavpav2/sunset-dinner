#!/usr/bin/env bash
# Jednorázové založení repa a nasazení na GitHub Pages.
# Předpoklad: `gh auth login` už proběhlo.
set -euo pipefail

REPO="sunset-dinner"
DOMAIN="$(cat public/CNAME)"

if ! gh auth status >/dev/null 2>&1; then
  echo "Nejsi přihlášený do GitHubu. Spusť nejdřív:  gh auth login" >&2
  exit 1
fi

USER="$(gh api user --jq .login)"
echo "GitHub účet: $USER"

if gh repo view "$USER/$REPO" >/dev/null 2>&1; then
  echo "Repo $USER/$REPO už existuje — jen pushuju."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$USER/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "Sunset Dinner Party — Střecha Radost × Bistro Karel, $DOMAIN"
fi

echo
echo "Build běží v Actions. Sleduj:  gh run watch"
echo
echo "── DNS záznam (zóna je na Wixu: ns14/ns15.wixdns.net) ───────"
echo "  Typ:     CNAME"
echo "  Host:    ${DOMAIN%%.*}"
echo "  Hodnota: $USER.github.io"
echo "  TTL:     1 hodina"
echo
echo "── Kontrolní URL ────────────────────────────────────────────"
echo "  https://$DOMAIN"
echo
echo "  Pozor: https://$USER.github.io/$REPO/ NEfunguje — kvůli souboru"
echo "  public/CNAME nastaví Pages custom doménu a github.io adresu na ni"
echo "  přesměruje. Do propsání DNS kontroluj lokálně přes 'npm run preview'."
echo
echo "Po propsání DNS: Settings → Pages → ověřit Custom domain = $DOMAIN"
echo "a zaškrtnout Enforce HTTPS."
echo
printf "Stav DNS zkontroluješ:  dig +short %s\n" "$DOMAIN"
