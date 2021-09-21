DOCKER_REPO := jeffspies/d2d
VERSION := 0.0.1

DOCKER_TAG := $(DOCKER_REPO):$(VERSION)
SRC_DIR := src
SRC_FILES := $(shell find $(SRC_DIR) -type f)

node_modules: package.json
	@yarn
	@touch node_modules

lib: node_modules $(SRC_DIR) $(SRC_FILES) tsconfig.json
	@yarn run clean
	@yarn run build
	@touch lib

build/checkpoint:
	@mkdir -p build/checkpoint

build/checkpoint/docker-build: build/checkpoint lib bin package.json Dockerfile
	@docker build -t $(DOCKER_TAG) .
	@touch build/checkpoint/docker-build

.PHONY: update-version
update-version:
	$(info Updating versions...)
	@echo "const version = '$(VERSION)'\nexport default version" > src/version.ts
	@npx json -I -f package.json -e 'this.version="$(VERSION)"'

.PHONY: publish
publish: build/checkpoint/docker-build update-version
# git commit with tag
	$(info Publishing to NPM...)
	# @npm publish
	$(info Publishing to Docker...)
	@docker push $(DOCKER_TAG)
# docker publish

.PHONY: docker
docker: build/checkpoint/docker-build
	$(info Generating templated content...)
	@docker run \
		--user $(UID):$(GID) \
		-v $(PWD)/example/.env:/.env \
		-v $(PWD)/example/templates:/input \
		-v $(PWD)/example/build/templates:/output \
		$(DOCKER_TAG)

.PHONY: run
run: lib
	@npm start

.PHONY: clean
clean:
	@rm -rf build lib node_modules example/build/templates

.DEFAULT_GOAL := run