.PHONY: build start install

install:
	npm install
	cd frontend && npm install

build:
	cd frontend && npm run build

start:
	npm exec concurrently \"npx @hexlet/chat-server --port 5001\" \"npx start-server -s ./frontend/dist -p $PORT\"
