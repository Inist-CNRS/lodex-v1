FROM node:0.12

ENV HTTP_PROXY=$HTTP_PROXY
ENV HTTPS_PROXY=$HTTPS_PROXY

RUN env
RUN cat /etc/resolv.conf

RUN mkdir /opt/app
RUN mkdir /data

VOLUME /data/
WORKDIR /opt/app/

ADD package.json /opt/app/
RUN npm install --unsafe-perm
ADD . /opt/app/



EXPOSE 3000

CMD []
ENTRYPOINT ["/opt/app/lodex", "/data"]
