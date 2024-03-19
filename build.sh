#!/bin/bash -ex

git_branch="$( git rev-parse --abbrev-ref HEAD )"
git_commit_id="$( git describe --tags --always HEAD 2>/dev/null )"
git_commit_date="$( git show -s --format='%ci' )"

json_build_info="$( jq -n --arg git_branch "${git_branch}" --arg git_commit_id "${git_commit_id}" --arg git_commit_date "${git_commit_date}" '{"git_branch":$git_branch, "git_commit_id":$git_commit_id, "git_commit_date":$git_commit_date}' )"

git="$( git describe --tags --always )"
tag="${tag:-0.0.0-debug}"
tag2="${tag2:-0.0.0-${git}-debug}"

docker build --build-arg json_build_info="${json_build_info}" -t summittech/summit-tech-odience-director-api:${tag} -t summittech/summit-tech-odience-director-api:${tag2} -f Dockerfile .
# docker push summittech/summit-tech-odience-director-api:${tag}
# docker push summittech/summit-tech-odience-director-api:${tag2}
