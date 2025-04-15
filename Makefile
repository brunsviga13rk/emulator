
.PHONY: build live clean format check
.EXPORT_ALL_VARIABLES: build live check

include .env

build:
	npm run build

live:
	npm run dev

clean:
	rm -rf dist

format:
	npx prettier -w .

check:
	npx prettier -c .
	npm run build
