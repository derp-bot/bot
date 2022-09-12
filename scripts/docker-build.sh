#!/usr/bin/env bash

IMAGE_NAME="derp-bot"
IMAGE_TAG="development"

DOCKER_BUILDKIT=1 docker build \
  --ssh default \
  --build-arg "GIT_SHA=$(git rev-parse --short HEAD)" \
  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  .
