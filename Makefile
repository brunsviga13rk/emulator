
.PHONY: build live clean format check

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
