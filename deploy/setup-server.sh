#!/usr/bin/env bash
# Run once on the server as root: sudo bash setup-server.sh
# Creates an unprivileged "deploy" user that can only rsync into the site's dist/ directory.
set -euo pipefail
DIST=/opt/stacks/1000110-xyz/dist
KEY='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIBVfdH24Rq2z7dOFc3twHbh91K/783KkYnDa4j+ziPE ci-deploy-1000110'

apt-get install -y rsync
RRSYNC=$(command -v rrsync || true)
if [ -z "$RRSYNC" ]; then
  RRSYNC=$(ls /usr/share/doc/rsync/scripts/rrsync* 2>/dev/null | head -1 || true)
  [ -n "$RRSYNC" ] || { echo "rrsync not found"; exit 1; }
  case "$RRSYNC" in *.gz) gunzip -c "$RRSYNC" > /usr/local/bin/rrsync ;; *) cp "$RRSYNC" /usr/local/bin/rrsync ;; esac
  chmod 755 /usr/local/bin/rrsync; RRSYNC=/usr/local/bin/rrsync
fi

id deploy >/dev/null 2>&1 || useradd --create-home --shell /bin/bash --comment "site deploy (rsync only)" deploy
chown -R deploy:deploy "$DIST"
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
echo "restrict,command=\"$RRSYNC -wo $DIST\" $KEY" > /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
echo "done: deploy user ready, not in docker/sudo groups: $(id deploy)"
