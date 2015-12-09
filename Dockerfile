FROM node:0.12

ENV HTTP_PROXY=$HTTP_PROXY
ENV HTTPS_PROXY=$HTTPS_PROXY

RUN mkdir /opt/app
RUN mkdir /data

VOLUME /data/
ADD . /opt/app/
WORKDIR /opt/app/

RUN env
RUN cat /etc/resolv.conf

RUN npm install --unsafe-perm

EXPOSE 3000

CMD []
ENTRYPOINT ["/opt/app/semtab", "/data"]
