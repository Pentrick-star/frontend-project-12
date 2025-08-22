.PHONY: build start install

install:
	npm install
	cd frontend && npm install

build:
	cd frontend && npm run build

start:
	node server.js
