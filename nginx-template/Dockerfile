FROM centos7:latest

MAINTAINER a567390 : github.com/remipichon inspired by https://github.com/grahamjenson/DR-CoN

RUN yum install -y nginx gettext \
    && yum clean all \
    && rm -rf /tmp/*

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log;

#Install unzip
RUN yum -y install unzip

#Install Consul Template
ENV CONSUL_TEMPLATE_VERSION 0.11.1
ADD https://releases.hashicorp.com/consul-template/0.15.0/consul-template_0.15.0_linux_amd64.zip /tmp/consul-template.zip
RUN unzip /tmp/consul-template.zip -d /usr/bin && \
    chmod +x /usr/bin/consul-template && \
    rm /tmp/consul-template.zip

#Uninstall Unzip
RUN yum -y remove 'unzip'


#Setup Consul Template Files
RUN mkdir /etc/consul-templates
ENV CT_FILE /etc/consul-templates/nginx-consul-template.conf

#Setup Nginx File
ENV NX_FILE /etc/nginx/conf.d/app.conf

#Default Variables
ENV CONSUL consul:8500
ENV SERVICE consul-8500

VOLUME /var/cache/nginx /var/lib/nginx/tmp /run \
    /etc/nginx/conf.d 

