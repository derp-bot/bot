#!/usr/bin/env bash

IMAGE_NAME="derp-bot"
IMAGE_TAG="development"

docker run \
  --init \
  --env DERP_BOT_TOKEN=${DERP_BOT_TOKEN} \
  --env "GIT_SHA=$(git rev-parse --short HEAD)" \
  --publish 3000:3000 \
  "${IMAGE_NAME}:${IMAGE_TAG}"
