FROM node:slim as run

USER root

RUN groupadd -r evendemy -g 1000 && useradd -u 1000 -r -g evendemy -m -d /opt/evendemy -s /sbin/nologin -c "Evendemy user" evendemy && chmod 755 /opt/evendemy

# This would be ./backend/dist
WORKDIR /opt/evendemy
COPY --chown=evendemy:evendemy ./backend/dist /opt/evendemy/backend
COPY --chown=evendemy:evendemy ./backend/node_modules /opt/evendemy/backend/node_modules
COPY --chown=evendemy:evendemy ./webapp/dist /opt/evendemy/webapp/


# run app
CMD "bash" "-c" "chmod o+rw-x /usr/src/meeting_images && chmod o+rw-x /usr/src/user_images && \
    su evendemy && \
    cd /usr/src/backend/ && node src/main.js"