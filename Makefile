# Reference Guide - https://www.gnu.org/software/make/manual/make.html
#
# Internal variables or constants.
#
FRONTEND_DIRECTORY ?= frontend
FLATTENER_DIRECTORY ?= pkg/processors/flattener
QUERY_SERVICE_DIRECTORY ?= pkg/query-service

REPONAME ?= signoz
DOCKER_TAG ?= latest

FRONTEND_DOCKER_IMAGE ?= frontend
FLATTERNER_DOCKER_IMAGE ?= query-service
QUERY_SERVICE_DOCKER_IMAGE ?= flattener-processor

all: build-push-frontend build-push-query-service build-push-flattener
# Steps to build and push docker image of frontend
.PHONY: build-frontend-amd64  build-push-frontend
# Step to build docker image of frontend in amd64 (used in build pipeline)
build-frontend-amd64:
	@echo "------------------"
	@echo "--> Building frontend docker image for amd64"
	@echo "------------------"
	@cd $(FRONTEND_DIRECTORY) && \
	docker build -f Dockerfile  --no-cache -t $(REPONAME)/$(FRONTEND_DOCKER_IMAGE):$(DOCKER_TAG) .  --build-arg TARGETPLATFORM="linux/amd64"

# Step to build and push docker image of frontend(used in push pipeline)
build-push-frontend:
	@echo "------------------"
	@echo "--> Building and pushing frontend docker image"
	@echo "------------------"
	@cd $(FRONTEND_DIRECTORY) && \
	docker buildx build --file Dockerfile --progress plane --no-cache --push --platform linux/amd64 --tag $(REPONAME)/$(FRONTEND_DOCKER_IMAGE):$(DOCKER_TAG) .

# Steps to build and push docker image of query service
.PHONY: build-query-service-amd64  build-push-query-service
# Step to build docker image of query service in amd64 (used in build pipeline)
build-query-service-amd64:
	@echo "------------------"
	@echo "--> Building query-service docker image for amd64"
	@echo "------------------"
	@cd $(QUERY_SERVICE_DIRECTORY) && \
	docker build -f Dockerfile  --no-cache -t $(REPONAME)/$(QUERY_SERVICE_DOCKER_IMAGE):$(DOCKER_TAG) .  --build-arg TARGETPLATFORM="linux/amd64"

# Step to build and push docker image of query in amd64 and arm64 (used in push pipeline)
build-push-query-service:
	@echo "------------------"
	@echo "--> Building and pushing query-service docker image"
	@echo "------------------"
	@cd $(QUERY_SERVICE_DIRECTORY) && \
	docker buildx build --file Dockerfile --progress plane --no-cache --push --platform linux/arm64,linux/amd64 --tag $(REPONAME)/$(QUERY_SERVICE_DOCKER_IMAGE):$(DOCKER_TAG) .

# Steps to build and push docker image of flattener
.PHONY: build-flattener-amd64  build-push-flattener
# Step to build docker image of flattener in amd64 (used in build pipeline)
build-flattener-amd64:
	@echo "------------------"
	@echo "--> Building flattener docker image for amd64"
	@echo "------------------"
	@cd $(FLATTENER_DIRECTORY) && \
	docker build -f Dockerfile  --no-cache -t $(REPONAME)/$(FLATTERNER_DOCKER_IMAGE):$(DOCKER_TAG) .  --build-arg TARGETPLATFORM="linux/amd64"

# Step to build and push docker image of flattener in amd64 (used in push pipeline)
build-push-flattener:
	@echo "------------------"
	@echo "--> Building and pushing flattener docker image"
	@echo "------------------"
	@cd $(FLATTENER_DIRECTORY) && \
	docker buildx build --file Dockerfile --progress plane --no-cache --push --platform linux/arm64,linux/amd64 --tag $(REPONAME)/$(FLATTERNER_DOCKER_IMAGE):$(DOCKER_TAG) .
