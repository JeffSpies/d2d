node_modules: package.json
	@yarn
	@touch node_modules

SRC_DIR := src
SRC_FILES := $(shell find $(SRC_DIR) -type f)

lib: node_modules $(SRC_DIR) $(SRC_FILES) tsconfig.json
	@yarn run clean
	@yarn run build
	@touch lib

build/checkpoint/docker-build: lib bin package.json Dockerfile
	@docker build -t template .
	@touch build/checkpoint/docker-build

.PHONY: run
run: build/checkpoint/docker-build
	$(info Generating templated content...)
	@docker run \
		--user $(UID):$(GID) \
		-v $(PWD)/example/.env:/.env \
		-v $(PWD)/example/templates:/input \
		-v $(PWD)/example/build/templates:/output \
		template

.DEFAULT_GOAL := run