.PHONY: wrapped-install chown npm

all: wrapped-install

wrapped-install:
	@docker run -it --rm -v `pwd`:/app -w /app --net=host -e NODE_ENV -e http_proxy -e https_proxy node:4-slim npm install

install: chown
	@npm install

chown:
	@test ! -d `pwd`/node_modules || docker run -it --rm -v `pwd`:/app node:5-slim chown -R `id -u`:`id -g` /app/node_modules
	@test ! -f `pwd`/package.json || docker run -it --rm -v `pwd`:/app node:5-slim chown -R `id -u`:`id -g` /app/package.json
	@test ! -f `pwd`/npm-debug.log || docker run -it --rm -v `pwd`:/app node:5-slim chown -R `id -u`:`id -g` /app/npm-debug.log

npm:
	@docker run -it --rm -v `pwd`:/app -w /app --net=host -e NODE_ENV -e http_proxy -e https_proxy node:4-slim npm $(filter-out $@,$(MAKECMDGOALS))
	@docker run -it --rm -v `pwd`:/app node:5-slim chown -R `id -u`:`id -g` /app/package.json /app/node_modules /app/npm-debug.log
