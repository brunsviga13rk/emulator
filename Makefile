
build:
	npm run build

live:
	npm run dev

clean:
	rm -rf dist

format:
	prettier -w .

check:
	prettier -c .
	npm run build
