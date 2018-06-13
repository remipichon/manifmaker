FROM node:4-alpine

# Docker client to use the Docker Socket Binding
ENV DEBIAN_FRONTEND noninteractive
USER root
RUN curl -sSL https://get.docker.com/ | sh 
ENV DOCKER_HOST tcp://dind:4242

COPY app /root/app/
RUN cd /root/app/; npm install;

ENTRYPOINT node /root/app/app.js