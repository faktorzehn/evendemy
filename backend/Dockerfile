FROM node:latest as buildBackend

USER root

WORKDIR /usr/src/backend
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build

FROM node:slim as run

RUN useradd -ms /bin/bash serviceUser

WORKDIR /usr/src/backend
COPY --from=buildBackend /usr/src/backend ./
COPY . .
USER serviceUser

# Change user here otherwise chmod will crash
CMD "bash" "-c" "cd /usr/src/backend/ && npm run start" 