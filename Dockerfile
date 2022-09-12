# syntax=docker/dockerfile:1

# Build stage
FROM golang:1.19-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN go build -o derp

# Final stage
FROM alpine:3 AS final

WORKDIR /app

COPY --from=builder /app/derp ./


RUN addgroup -g 1001 -S derpbot
RUN adduser -S derpbot -u 1001

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

USER derpbot

ENTRYPOINT ["/app/derp"]

