FROM node:16.13.2-alpine AS builder
RUN apk add --no-cache --virtual .gyp \
  libc6-compat \
  python3 \
  make \
  g++
WORKDIR /app
COPY package*.json ./
RUN npm ci --prod

# Production image, copy all the files
FROM node:alpine AS runner
WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
  git

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY . .
COPY --from=builder /app/node_modules ./node_modules

USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
