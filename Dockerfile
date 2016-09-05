# see https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:argon

# Copy the local code source
# and tell docker this folder
# must be used when running a
# container.
COPY . /app
WORKDIR /app

# Run the test to make sure
# the docker image will be ok.
# If the test fails, the image
# will not be built
RUN rm -rf ./node_modules && \
    npm install --production && \
    npm cache clean

# data folder is a volume because it will
# contains the user's data files (ex: CSV)
VOLUME /app/data

RUN mkdir -p /opt/ezmaster/config/
RUN ln -s /app/config.local.js /opt/ezmaster/config/config.json
RUN ln -s /app/data /opt/ezmaster/data

# run the application
ENTRYPOINT ["/app/docker-entrypoint.sh"]
EXPOSE 3000
