FROM node:4-alpine

# Docker client to use the Docker Socket Binding
ENV DEBIAN_FRONTEND noninteractive
USER root
RUN curl -sSL https://get.docker.com/ | sh 
ENV DOCKER_HOST tcp://dind:4242

COPY app /root/app/
RUN cd /root/app/; npm install;

ENTRYPOINT node /root/app/app.js

# docker build -t assomaker/export_pdf .

# dev mode : with code in shared volume
# docker rm -f nodeexport; docker run -v /var/run/docker.sock:/var/run/docker.sock --name nodeexport -p 3030:3030 -d -v /Users/remi/WebstormProjects/manifmaker/production/export-pdf-node:/root --entrypoint="" assomaker/export_pdf tail -f /dev/null; docker exec -ti nodeexport sh
# cd /root/app/; npm install; node app.js

# normal mode
# docker build -t assomaker/export_pdf .; docker rm -f nodeexport; docker run -v /var/run/docker.sock:/var/run/docker.sock --name nodeexport -p 3030:3030 -d  assomaker/export_pdf; docker logs -f nodeexport

