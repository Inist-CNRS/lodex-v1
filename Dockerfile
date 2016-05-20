# see https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install && \
	npm cache clean

# Bundle app source
COPY . /usr/src/app

# data folder is a volume because it will
# contains the user's data files (ex: CSV)
VOLUME /usr/src/app/data

# run the application
CMD ["npm", "start"]
EXPOSE 3000
