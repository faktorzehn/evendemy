FROM node:latest as build

WORKDIR /usr/src/backend
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build


FROM node:latest as run

WORKDIR /usr/src/backend
COPY --from=build /usr/src/backend ./

COPY . .
CMD "bash" "-c" "cd /usr/src/backend && npm run start" 