FROM node:latest as buildBackend

WORKDIR /usr/src/backend
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build

FROM node:slim as run

RUN useradd -ms /bin/bash serviceUser

WORKDIR /home/serviceUser
COPY --from=buildBackend /usr/src/backend ./

RUN chmod -wx -R .

VOLUME /usr/share/meeting_images
VOLUME /usr/share/user_images

RUN chmod +rw -R /usr/share/meeting_images
RUN chmod +rw -R /usr/share/user_images

COPY . .

# Change user here otherwise chmod will crash
USER serviceUser
CMD "bash" "-c" "cd /home/serviceUser/backend/   && npm run start" 