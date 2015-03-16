.PHONY: clean
.PHONY: theme

default: clean node_modules

clean:
	@rm -rf node_modules/

node_modules: package.json
	@npm install

theme: node_modules
	@cp -r node_modules/ghost/content/themes/casper content/themes/
