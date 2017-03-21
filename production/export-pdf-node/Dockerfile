FROM node:4-alpine

# Docker client to use the Docker Socket Binding
ENV DEBIAN_FRONTEND noninteractive
USER root
RUN curl -sSL https://get.docker.com/ | sh 
ENV DOCKER_HOST tcp://dind:4242

# npm HTTP server to run Docker cmd
#RUN npm install dockerode -g
#RUN npm i koa
#RUN npm install babel-register --save-dev
#npm install --save-dev babel-plugin-transform-runtime

RUN npm install express --save
RUN  npm install express

# docker rm -f nodeexport; docker run --name nodeexport -p 3030:3030 -d -v /Users/remi/WebstormProjects/manifmaker/production/export-pdf-node:/root/app  assomaker/export_pdf tail -f /dev/null
