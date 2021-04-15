#! /usr/bin/env bash

# Thanks Huggybear.
function _punt() {
  echo "$1"
  exit 1
}

DERP_BOT=derp-bot

# Do we know the name of the container we're running?
[ -z "${CONTAINER_NAME}" ] && _punt "No CONTAINER_NAME set."

# Do we have the token for running the actual bot?
[ -z "${DISCORD_BOT_TOKEN}" ] && _punt "No DISCORD_BOT_TOKEN set."

# First order of business, log in to Docker Hub to fetch our private image.
# This requires some env. If we don't have it, die.
[ -z "${DOCKER_USERNAME}" ] && _punt "No DOCKER_USERNAME set."
[ -z "${DOCKER_PASSWORD}" ] && _punt "No DOCKER_PASSWORD set."

# Now that that's out of the way, log in.
echo "${DOCKER_PASSWORD}" | docker login --username "${DOCKER_USERNAME}" --password-stdin

# Grab the latest image.
docker pull drhayes/derp:latest

# Stop all running derp-bot containers.
RUNNING_ID=$(docker ps -qf name=derp-bot)
[ -n "${RUNNING_ID}" ] && docker rm -f ${RUNNING_ID}

# Start a new one running.
docker run \
  --name derp-bot \
  --detach \
  --env DISCORD_BOT_TOKEN=${DISCORD_BOT_TOKEN} \
  --restart unless-stopped \
  ${CONTAINER_NAME}:latest
