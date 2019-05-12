FROM node:latest

MAINTAINER Oussama Lagha <oussama.lagha@heig-vd.ch>

COPY src /opt/res/

WORKDIR /opt/res/

RUN npm install

ENTRYPOINT ["node", "/opt/res/musician.js"]