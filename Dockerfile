FROM python:latest
FROM node:latest

RUN mkdir -p /polarbear

WORKDIR /polarbear

COPY . /polarbear

RUN cd /polarbear
RUN npm i
RUN cd ..

EXPOSE 3002

CMD ["npm","start"]