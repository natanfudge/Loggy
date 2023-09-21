git add -A
git commit -m %1
git submodule foreach "git add -A && git commit -m %1 && git push"