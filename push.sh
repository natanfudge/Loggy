#!/bin/bash
git commit -am "$1"
git push
#It will always push to main which is not optimal but works for now
git submodule foreach git commit -am "$1" && git push origin HEAD:main