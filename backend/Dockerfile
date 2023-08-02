FROM node:latest as buildBackend

USER root

WORKDIR /usr/src/backend
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build

FROM node:slim as run

RUN useradd -ms /bin/bash serviceUser

WORKDIR /home/serviceUser
COPY --from=buildBackend /usr/src/backend ./

# Change user here otherwise chmod will crash
USER serviceUser
CMD "bash" "-c" "cd /home/serviceUser/backend/ && npm run start" 