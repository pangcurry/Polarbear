FROM node:latest

RUN mkdir -p /polarbear
WORKDIR /polarbear
ADD . /polarbear

RUN npm i
RUN npm i -g pm2 nodejs

CMD ["pm2","start","ecosystem.config.js"]