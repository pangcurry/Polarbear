FROM python:latest
FROM jrottenberg/ffmpeg:latest
FROM node:latest

RUN mkdir -p /polarbear

WORKDIR /polarbear

COPY . /polarbear

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y python-pip
RUN apt-get install -y python3-pip
RUN apt-get install -y ffmpeg
RUN pip3 install pytube
RUN cd /polarbear
RUN npm i

EXPOSE 3002
CMD ["npm","start"]