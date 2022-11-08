FROM node:16.17.0-alpine

USER root

RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY quasar.conf.js ./
COPY package*.json ./

RUN npm cache clean --force
RUN npm install -g @quasar/cli

EXPOSE 8000
CMD /bin/sh