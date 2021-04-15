FROM node:14.15.1-alpine3.12

WORKDIR /app
ENV NODE_ENV production
COPY package*.json ./
RUN npm clean-install
COPY . .

CMD ["npm", "start"]
