#!/usr/bin/env bash
# Writes an ssh alias "gl-prod" for the deploy from the production environment secrets. Prints no secret.
# Host key: only HOSTINGER_SSH_KNOWN_HOSTS is trusted (never ssh-keyscan); StrictHostKeyChecking stays "yes".
set -euo pipefail
for v in HOSTINGER_SSH_PRIVATE_KEY HOSTINGER_SSH_HOST HOSTINGER_SSH_USER HOSTINGER_SSH_PORT HOSTINGER_SSH_KNOWN_HOSTS; do
  [ -n "${!v:-}" ] || { echo "::error::secret $v is not set in the production environment"; exit 1; }
done
[[ "$HOSTINGER_SSH_PORT" =~ ^[0-9]+$ ]] || { echo "::error::HOSTINGER_SSH_PORT is not a number"; exit 1; }
d="$HOME/.ssh"; mkdir -p "$d"; chmod 700 "$d"
(umask 077; printf '%s\n' "$HOSTINGER_SSH_PRIVATE_KEY" > "$d/gl_deploy"; printf '%s\n' "$HOSTINGER_SSH_KNOWN_HOSTS" > "$d/gl_known_hosts")
ssh-keygen -y -f "$d/gl_deploy" > /dev/null 2>&1 || { echo "::error::HOSTINGER_SSH_PRIVATE_KEY is not a valid unencrypted private key"; exit 1; }
entry=$HOSTINGER_SSH_HOST; [ "$HOSTINGER_SSH_PORT" = 22 ] || entry="[$HOSTINGER_SSH_HOST]:$HOSTINGER_SSH_PORT"
ssh-keygen -F "$entry" -f "$d/gl_known_hosts" > /dev/null || { echo "::error::HOSTINGER_SSH_KNOWN_HOSTS has no key for $entry"; exit 1; }
cat > "$d/config" <<EOF
Host gl-prod
  HostName $HOSTINGER_SSH_HOST
  Port $HOSTINGER_SSH_PORT
  User $HOSTINGER_SSH_USER
  IdentityFile $d/gl_deploy
  IdentitiesOnly yes
  UserKnownHostsFile $d/gl_known_hosts
  StrictHostKeyChecking yes
  BatchMode yes
  ConnectTimeout 20
  ServerAliveInterval 15
  ServerAliveCountMax 4
EOF
chmod 600 "$d/config"
ssh gl-prod true || { echo "::error::ssh to the host failed (host key mismatch, key not authorised, or SSH disabled)"; exit 1; }
echo "ssh gl-prod ok"
