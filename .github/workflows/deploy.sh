#!/bin/bash
set -ex

HOST="$FTP_HOST"
USER="$FTP_USER"
PASS="$FTP_PASSWORD"
TARGET="/mime"
IGNORE_FILE=".ftpignore"
FROM_SHA="${GIT_PREV_SHA:-HEAD^}"
TO_SHA="${GIT_CURR_SHA:-HEAD}"

# Získání změněných souborů
if git rev-parse "$FROM_SHA" >/dev/null 2>&1; then
  CHANGED_FILES=$(git diff --name-only "$FROM_SHA" "$TO_SHA")
  DELETED_FILES=$(git diff --diff-filter=D --name-only "$FROM_SHA" "$TO_SHA")
else
  echo "⚠️ Nelze najít předchozí SHA, nasazuji vše."
  CHANGED_FILES=$(find app/html app/src -type f; find dist -type f \( -name "style.css" -o -name "script.js" \))
  DELETED_FILES=""
fi

# Funkce pro kontrolu ignorace
should_ignore() {
  local path="$1"
  [[ ! -f "$IGNORE_FILE" ]] && return 1
  while read -r pattern; do
    [[ "$pattern" == "" || "$pattern" == \#* ]] && continue
    if [[ "$path" == $pattern* || "$path" == ./$pattern* ]]; then
      return 0
    fi
  done < "$IGNORE_FILE"
  return 1
}

# Vygeneruj SFTP skript
SFTP_CMDS=$(mktemp)
echo "cd $TARGET" > "$SFTP_CMDS"

# Mapa pro deduplikaci mkdir
declare -A created_dirs

# Změněné soubory (upload)
echo "$CHANGED_FILES" | while read -r file; do
  [[ -f "$file" ]] || continue
  if should_ignore "$file"; then continue; fi

  if [[ "$file" == dist/style.css || "$file" == dist/script.js ]]; then
    remote_path="$TARGET/$(basename "$file")"
    echo "put \"$file\" \"$remote_path\"" >> "$SFTP_CMDS"

  elif [[ "$file" == app/html/* ]]; then
    relative="${file#app/html/}"
    remote_dir="$TARGET/html/$(dirname "$relative")"
    if [[ -z "${created_dirs[$remote_dir]}" ]]; then
      echo "mkdir \"$remote_dir\"" >> "$SFTP_CMDS"
      created_dirs["$remote_dir"]=1
    fi
    echo "put \"$file\" \"$remote_dir/$(basename "$file")\"" >> "$SFTP_CMDS"

  elif [[ "$file" == app/src/* ]]; then
    relative="${file#app/src/}"
    remote_dir="$TARGET/src/$(dirname "$relative")"
    if [[ -z "${created_dirs[$remote_dir]}" ]]; then
      echo "mkdir \"$remote_dir\"" >> "$SFTP_CMDS"
      created_dirs["$remote_dir"]=1
    fi
    echo "put \"$file\" \"$remote_dir/$(basename "$file")\"" >> "$SFTP_CMDS"
  fi
done

# Smazané soubory (delete)
echo "$DELETED_FILES" | while read -r file; do
  if should_ignore "$file"; then continue; fi

  if [[ "$file" == dist/style.css || "$file" == dist/script.js ]]; then
    remote_path="$TARGET/$(basename "$file")"
    echo "rm \"$remote_path\"" >> "$SFTP_CMDS"

  elif [[ "$file" == app/html/* ]]; then
    relative="${file#app/html/}"
    remote_path="$TARGET/html/$relative"
    echo "rm \"$remote_path\"" >> "$SFTP_CMDS"

  elif [[ "$file" == app/src/* ]]; then
    relative="${file#app/src/}"
    remote_path="$TARGET/src/$relative"
    echo "rm \"$remote_path\"" >> "$SFTP_CMDS"
  fi
done

# Spuštění přes sshpass + sftp
if ! command -v sshpass >/dev/null; then
  echo "🛠️ Installing sshpass..."
  sudo apt-get update && sudo apt-get install -y sshpass
fi

echo "🔐 Připojuji se k SFTP a nahrávám..."
sshpass -p "$PASS" sftp -oBatchMode=no -oStrictHostKeyChecking=no "$USER@$HOST" < "$SFTP_CMDS"

rm "$SFTP_CMDS"
echo "✅ Hotovo – změněné soubory byly nahrány a smazané odstraněny přes SFTP."