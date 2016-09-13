# see https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:argon

# Tell docker this folder must be used when running a container.
WORKDIR /app
# Install the node modules only
COPY ./package.json /app
RUN rm -rf ./node_modules && \
    npm install --production && \
    npm cache clean
# Copy the local code source
COPY . /app


# ezmasterizing of lodex
# See https://github.com/Inist-CNRS/ezmaster#ezmasterizing-an-application
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/app/example/data.json", \
  "dataPath":   "/app/example/data/" \
}' > /etc/ezmaster.json

# run the application
ENTRYPOINT ./docker-entrypoint.sh
EXPOSE 3000
