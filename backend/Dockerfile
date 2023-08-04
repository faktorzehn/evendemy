FROM node:slim as run

USER root

WORKDIR /usr/src/backend
COPY package*.json ./

RUN npm install

RUN useradd -ms /bin/bash serviceUser

USER serviceUser

# Change user here otherwise chmod will crash
CMD "bash" "-c" "cd /usr/src/backend/ && ls && npm run start" 