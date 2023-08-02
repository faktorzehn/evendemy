FROM node:latest as buildBackend

WORKDIR /usr/src/backend
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build

FROM node:latest as buildFrontend

WORKDIR /usr/src/webapp
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build

FROM node:slim as run

RUN useradd -ms /bin/bash serviceUser

WORKDIR /home/serviceUser
COPY --from=buildBackend /usr/src/backend ./
COPY --from=buildFrontend /usr/src/webapp ./
RUN chmod -wx -R ./
RUN chmod +rw -R /home/serviceUser/webapp/src/assets/*_images

COPY . .
CMD "bash" "-c" "cd /home/serviceUser && npm run start" 