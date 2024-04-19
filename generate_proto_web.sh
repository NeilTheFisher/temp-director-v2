#!/bin/sh

is_windows() {
    case "$OSTYPE" in
        msys*|mingw*|cygwin*)
        return 0  # Windows
        ;;
        *)
        return 1  # not Windows
        ;;
    esac
}

echo "Script is starting"

mkdir -p ./generated-protos/

if command -v git; then
    ssh_command="$(ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes git@gitlab.summit-tech.org)"
    timeout 5 "$ssh_command"
    git submodule update --init
else
    echo "Skipping submodule update"
fi

set -xe

protoc_exec="npx"
protoc_path="$(bun pm bin)/protoc-gen-ts"
if is_windows; then
    protoc_path+=.exe
fi

echo "protoc-gen-ts path: $protoc_path"

$protoc_exec protoc \
    --ts_out ./generated-protos \
    --plugin "protoc-gen-ts=$protoc_path" \
    --proto_path ./odienceapis \
    ./odienceapis/api/media/grpc/media/v1/media.proto \
    ./odienceapis/api/common/annotations/field_behavior.proto \
    ./odienceapis/api/media/model/resources/media/v1/media.proto \
    ./odienceapis/api/common/model/types/v1/media.proto
