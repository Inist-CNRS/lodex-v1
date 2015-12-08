FROM node:0.12

RUN mkdir /var/data
VOLUME /var/data

ADD . /opt/app
WORKDIR /opt/app

RUN npm install --unsafe-perm

EXPOSE 3000

CMD []
ENTRYPOINT ["/opt/app/cli", "/var/data"]
