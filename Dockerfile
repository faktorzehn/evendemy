FROM node:slim as run

USER root

# This would be ./backend/dist
WORKDIR /usr/src/
COPY ./backend/dist /usr/src/backend
COPY ./backend/node_modules /usr/src/backend/node_modules
COPY ./webapp/dist /usr/src/webapp/


# Add the user serviceUser so we dont execute with root privileges
RUN useradd -ms /bin/bash serviceUser

# Change the user
USER serviceUser

CMD "bash" "-c" "cd /usr/src/backend/ && node src/main.js" 