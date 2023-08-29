FROM node:slim as run

USER root

RUN groupadd -r evendemy -g 1000 && useradd -u 1000 -r -g evendemy -m -d /opt/evendemy -s /sbin/nologin -c "Evendemy user" spring && chmod 755 /opt/evendemy

# This would be ./backend/dist
WORKDIR /opt/evendemy
COPY ./backend/dist /opt/evendemy/backend
COPY ./backend/node_modules /opt/evendemy/backend/node_modules
COPY ./webapp/dist /opt/evendemy/webapp/

# run app
CMD "bash" "-c" "cd /opt/evendemy/backend/ && node src/main.js" 