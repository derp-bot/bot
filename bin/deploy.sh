#! /usr/bin/env bash

echo "Attempting a deploy..."

# Magical bash line to locate path of this script.
MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# We're going to assume we have an ssh-key that will get us into the server.
# To ssh in, we need an IP for this server that was dynamically set up somewhere else.
# We do that by talking to the Vultr API. For that we need a key.
if [ -z "${VULTR_API_KEY}" ]; then
  echo "VULTR_API_KEY is not set. Quitting."
  exit 1
fi

# What is the IP of the server?
DERP_SERVER_IP=$(curl --silent "https://api.vultr.com/v2/instances?label=derp-bot" -X GET -H "Authorization: Bearer ${VULTR_API_KEY}"\
  | jq --raw-output .instances[0].main_ip)

ssh root@$DERP_SERVER_IP "DOCKER_USERNAME=$DOCKER_USERNAME DOCKER_PASSWORD=$DOCKER_PASSWORD CONTAINER_NAME=$CONTAINER_NAME DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN exec bash" < "$MY_DIR/run-latest-derp.sh"
