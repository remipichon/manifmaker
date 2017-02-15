FROM ubuntu

RUN apt-get update -y
RUN apt-get install -y git curl
RUN curl https://install.meteor.com/ | sh
RUN cd /root; git clone https://github.com/assomaker/manifmaker.git
VOLUME /root/manifmaker

CMD tail -f /dev/null
