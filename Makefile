.PHONY: default

DERP_BIN := bin/derp
GO_FILES := $(shell find . -name '*.go' -type f -not -path "./vendor/*")

default: $(DERP_BIN)

$(DERP_BIN): $(GO_FILES) bin
	go build -o $@ .

bin:
	mkdir -p $@

