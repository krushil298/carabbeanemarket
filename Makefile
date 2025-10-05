# Convenience commands
.PHONY: dev build fmt lint

dev:
	npm run dev || pnm dev || yarn dev

build:
	npm run build || pnm build || yarn build

fmt:
	npx prettier -w . || pnm prettier -w . || echo "prettier not found"

lint:
	npx eslint . || pnm eslint . || echo "eslint not found"