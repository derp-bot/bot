#!/usr/bin/env bash

IMAGE_NAME="derp-bot"
IMAGE_TAG="development"

DOCKER_BUILDKIT=1 docker build \
  --ssh default \
  --build-arg "NODE_ENV=development" \
  --build-arg "GITHUB_SHA=$(git rev-parse --short HEAD)" \
  --build-arg "GITHUB_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)" \
  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  .
