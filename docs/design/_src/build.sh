#!/usr/bin/env bash
# Assemble self-contained mockups: tokens.css + header + body + footer. Usage: build.sh <nn-name> <title> <active-tab-index> <mock-note>
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd); out="$here/../screens"
name=$1; title=$2; active=$3; note=$4
hdr=$(cat "$here/header.html")
for i in 0 1 2 3 4 5 6 7 8; do if [ "$i" = "$active" ]; then v=true; else v=false; fi; hdr=${hdr//__T$i/$v}; done
{
  printf '<!doctype html>\n<html lang="ro">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>%s · Fluxuri de date</title>\n<style>\n' "$title"
  cat "$here/tokens.css"
  [ -f "$here/$name.css" ] && cat "$here/$name.css"
  printf '</style>\n</head>\n<body>\n<div class="mock-note" lang="en"><b>Design mockup, not the app.</b> %s</div>\n' "$note"
  printf '%s\n' "$hdr"
  cat "$here/$name.body.html"
  cat "$here/footer.html"
  printf '</body>\n</html>\n'
} > "$out/$name.html"
echo "built $out/$name.html ($(wc -c < "$out/$name.html") bytes)"
