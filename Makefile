NAME=lodex
PORT=3000

.PHONY: start stop

build: Dockerfile
	docker build -t ${NAME}  --build-arg HTTP_PROXY=${HTTP_PROXY} --build-arg HTTPS_PROXY=${HTTPS_PROXY} .

run:
	docker run -p ${PORT}:3000 -v `pwd`:/data ${NAME}

start:
	docker run -p ${PORT}:3000 -d -v `pwd`:/data ${NAME}

stop:
	docker stop `docker ps | grep ${NAME} | awk '{print $1}'`
