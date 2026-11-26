#!/usr/bin/env bash
set -euo pipefail

deployment=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
thumbnails="$HOME/Proyectos/read-it/thumbnails"
track_it="$HOME/Proyectos/track-it"
caddyfile="$track_it/Caddyfile"
track_compose="$track_it/compose.yaml"
proxy=track-it-web-1
hostname=read-it-nb.duckdns.org

sudo -v
umask 077
credentials="$HOME/.config/read-it-thumbnails"
mkdir -p -- "$credentials"
work=$(mktemp -d "$credentials/activation.XXXXXX")
trap 'rm -f -- "$work/compose.env" "$work/Caddyfile" "$work/compose.yaml" "$work/container.Caddyfile" "$work/password" "$work/htpasswd"; rmdir -- "$work"' EXIT

password_file="$credentials/password"
password_hash="$credentials/htpasswd"
if [[ ! -s "$password_hash" ]]; then
    if [[ ! -s "$password_file" ]]; then
        openssl rand -hex 32 > "$work/password"
        mv -- "$work/password" "$password_file"
    fi
    hash=$(openssl passwd -6 -stdin < "$password_file")
    printf 'readit:%s\n' "$hash" > "$work/htpasswd"
    mv -- "$work/htpasswd" "$password_hash"
fi

cat > "$work/compose.env" <<EOF
THUMBNAIL_DIRECTORY=$thumbnails
THUMBNAIL_DOCKER_NETWORK=track-it_default
THUMBNAIL_PASSWORD_FILE=$password_hash
THUMBNAIL_UID=$(id -u)
THUMBNAIL_GID=$(id -g)
EOF
storage=(sudo docker compose --project-name readit-thumbnails --env-file "$work/compose.env" -f "$deployment/compose.yaml")

cp -- "$caddyfile" "$work/Caddyfile"
if ! grep -Fxq "$hostname {" "$caddyfile"; then
    printf '\n%s {\n\treverse_proxy readit-thumbnails:8080\n}\n' "$hostname" >> "$work/Caddyfile"
elif ! grep -Fxq $'\treverse_proxy readit-thumbnails:8080' "$caddyfile"; then
    printf 'El host %s ya tiene otra configuración en %s.\n' "$hostname" "$caddyfile" >&2
    exit 1
fi

# Keep the host Caddyfile mounted when Track It next recreates its web container.
if grep -Fq './Caddyfile:/etc/caddy/Caddyfile' "$track_compose"; then
    cp -- "$track_compose" "$work/compose.yaml"
else
    awk '
        { print }
        /^      - caddy_config:\/config[[:space:]]*$/ {
            print "      - ./Caddyfile:/etc/caddy/Caddyfile:ro"
            mounts++
        }
        END { if (mounts != 1) exit 1 }
    ' "$track_compose" > "$work/compose.yaml"
fi
docker compose --project-directory "$track_it" -f "$work/compose.yaml" config --quiet
sudo docker exec "$proxy" cat /etc/caddy/Caddyfile > "$work/container.Caddyfile"
if ! cmp -s "$caddyfile" "$work/container.Caddyfile" &&
   ! cmp -s "$work/Caddyfile" "$work/container.Caddyfile"; then
    printf 'El Caddyfile de Track It difiere del que tiene el contenedor. Revisá ambos antes de recargar.\n' >&2
    exit 1
fi
sudo docker exec -i "$proxy" caddy validate --config - --adapter caddyfile < "$work/Caddyfile"

"${storage[@]}" config --quiet
"${storage[@]}" up -d --no-deps readit-thumbnails
cover=http://readit-thumbnails:8080/thumbnails/books/cw8nOHg5spgC.jpg
for attempt in {1..10}; do
    if sudo docker exec "$proxy" wget -q -T 3 -O /dev/null "$cover"; then break; fi
    if [[ "$attempt" == 10 ]]; then
        printf 'Caddy no pudo leer una portada del contenedor.\n' >&2
        exit 1
    fi
    sleep 1
done

backup=$(mktemp -d "$credentials/track-it-backup.XXXXXX")
cp -- "$caddyfile" "$backup/Caddyfile"
cp -- "$track_compose" "$backup/compose.yaml"
chmod 0644 "$work/Caddyfile"
if ! cmp -s "$work/Caddyfile" "$work/container.Caddyfile"; then
    sudo docker cp "$work/Caddyfile" "$proxy:/etc/caddy/Caddyfile"
fi
if ! sudo docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile; then
    if ! cmp -s "$work/Caddyfile" "$work/container.Caddyfile"; then
        chmod 0644 "$work/container.Caddyfile"
        sudo docker cp "$work/container.Caddyfile" "$proxy:/etc/caddy/Caddyfile"
    fi
    exit 1
fi
for file in Caddyfile compose.yaml; do
    if ! cmp -s "$work/$file" "$track_it/$file"; then
        temporary=$(mktemp "$track_it/.$file.readit.XXXXXX")
        cat "$work/$file" > "$temporary"
        chmod --reference="$track_it/$file" "$temporary"
        mv -fT -- "$temporary" "$track_it/$file"
    fi
done

printf 'Caddy configurado para https://%s/thumbnails/\n' "$hostname"
printf 'Respaldo de Track It: %s\n' "$backup"
printf 'Contraseña para Vercel: %s\n' "$password_file"
