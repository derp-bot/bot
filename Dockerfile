FROM node:14-alpine3.13

ARG USER=derp
ENV HOME=/home/$USER

RUN apk add --update sudo

RUN adduser -D $USER \
        && echo "$USER ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$USER \
        && chmod 0440 /etc/sudoers.d/$USER

USER $USER
WORKDIR $HOME

# Bring in the packages and install everything.
COPY --chown=$USER:$USER ["package.json", "package-lock.json", "./"]
RUN npm ci

# Now copy everything else.
COPY --chown=$USER:$USER . .

# Now build from Typescript to JS.
RUN npm run build

# Run this thing.
CMD ["npm", "start"]
