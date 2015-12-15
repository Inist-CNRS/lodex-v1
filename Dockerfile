FROM node:0.12
ENV HTTP_PROXY=$HTTP_PROXY HTTPS_PROXY=$HTTPS_PROXY
RUN mkdir /opt/app && \
    mkdir /data
VOLUME /data/
WORKDIR /opt/app/
ADD package.json /opt/app/
RUN npm install --unsafe-perm
ADD . /opt/app/
EXPOSE 3000
CMD []
ENTRYPOINT ["/opt/app/lodex", "/data"]
