NAME=semtab
PORT=3000

.PHONY: start stop

build: Dockerfile
	docker build -t ${NAME} .

start:
	docker run -p ${PORT}:3000 -d -v `pwd`:/data ${NAME}

stop:
	docker stop $(docker ps | grep ${NAME} | awk '{print $1}')
