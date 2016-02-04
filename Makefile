NAME=lodex
PORT=3000

.PHONY: start stop

build: Dockerfile
	docker build -t ${NAME}  --build-arg HTTP_PROXY=${HTTP_PROXY} --build-arg HTTPS_PROXY=${HTTPS_PROXY} .

run:
	docker run  -d --add-host=parenthost:`ip route show | grep docker0 | awk '{print $$9}'` -p ${PORT}:3000 -v `pwd`/data:/data ${NAME}

start:
	docker run --add-host=parenthost:`ip route show | grep docker0 | awk '{print $$9}'` -p ${PORT}:3000 -d -v `pwd`/data:/data ${NAME}

stop:
	DID=`docker ps | grep ${NAME} | awk '{print $$1}'` && docker stop $$DID
