.PHONY: install chown npm clean

all: install chown

install:
	@docker run -it --rm -v `pwd`:/app -w /app --net=host -e NODE_ENV -e http_proxy -e https_proxy node:4 npm install

chown:
	@test ! -d `pwd`/node_modules || docker run -it --rm -v `pwd`:/app node:4 chown -R `id -u`:`id -g` /app/node_modules
	@test ! -f `pwd`/package.json || docker run -it --rm -v `pwd`:/app node:4 chown -R `id -u`:`id -g` /app/package.json
	@test ! -f `pwd`/npm-debug.log || docker run -it --rm -v `pwd`:/app node:4 chown -R `id -u`:`id -g` /app/npm-debug.log

npm:
	@docker run -it --rm -v `pwd`:/app -w /app --net=host -e NODE_ENV -e http_proxy -e https_proxy node:4 npm $(filter-out $@,$(MAKECMDGOALS))

clean:
	@rm -Rf ./node_modules/ ./npm-debug.log

