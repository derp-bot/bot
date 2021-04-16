#! /usr/bin/env bash

echo "Attempting a deploy..."

# Magical bash line to locate path of this script.
MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# # We're going to assume we have an ssh-key that will get us into the server.
# # To ssh in, we need an IP for this server that was dynamically set up somewhere else.
# # We do that by talking to the Vultr API. For that we need a key.
# if [ -z "${VULTR_API_KEY}" ]; then
#   echo "VULTR_API_KEY is not set. Quitting."
#   exit 1
# fi

# ssh root@${SSH_HOST} -i ~/.ssh/derp.key "DOCKER_USERNAME=$DOCKER_USERNAME DOCKER_PASSWORD=$DOCKER_PASSWORD CONTAINER_NAME=$CONTAINER_NAME DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN exec bash" < "$MY_DIR/run-latest-derp.sh"

# Create the remote context we'll use to get at our machine's docker daemon.
docker context create remote --docker "host=ssh://root@${SSH_HOST}"
docker context use remote

# Force an update of things.
docker-compose --project-directory ${MY_DIR}/.. pull
# Stand it back up.
docker-compose --project-directory ${MY_DIR}/.. up --detach
