FROM node:latest

WORKDIR /usr/src/backend
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build