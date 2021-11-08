.PHONY: cover

BIN_PATH:=node_modules/.bin/

all:	ducatus-wallet-client-rev.js

clean:
	rm ducatus-wallet-client-rev.js

ducatus-wallet-client-rev.js: index.js lib/*.js
	${BIN_PATH}browserify $< > $@

cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --reporter spec test
