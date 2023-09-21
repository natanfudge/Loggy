#!/bin/bash
message=$1
git add -A
git commit -m $message
git push
#It will always push to main which is not optimal but works for now
git submodule foreach git add -A && git commit -m $message && git push origin HEAD:main