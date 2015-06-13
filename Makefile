TESTS = test/**/*.test.js
TEST_TIMEOUT = 5000
MOCHA_REPORTER = spec
NPM_REGISTRY = ""

all: test

# 安装package.json中的依赖文件
install:
	@npm install $(NPM_REGISTRY)
	
# 测试之前首先确保有config文件
pretest:
	@if ! test -f config.js; then \
		cp config.default.js config.js; \
	fi
	@if ! test -d public/upload; then \
		mkdir public/upload; \
	fi

# 进行测试
test: install pretest
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(MOCHA_REPORTER) \
		-r should \
		-r test/env \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)
# 测试覆盖率
test-cov cov: install pretest
	@NODE_ENV=test node \
		node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/mocha/bin/_mocha \
		-- \
		-r should \
		-r test/env \
		--reporter $(MOCHA_REPORTER) \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)

# 运行项目
run:
	@node app.js

start: install build
	@NODE_ENV=production nohup ./node_modules/.bin/pm2 start app.js -i 0 --name "cnode" --max-memory-restart 400M >> cnode.log 2>&1 &

restart: install build
	@NODE_ENV=production nohup ./node_modules/.bin/pm2 restart "cnode" >> cnode.log 2>&1 &

.PHONY: install test cov test-cov build run start restart
