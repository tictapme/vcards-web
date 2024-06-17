#!/bin/bash
# git get current branch and store it in a variable
current_branch=$(git branch | grep \* | cut -d ' ' -f2)
# replace_url.sh script is executed with the first argument as current branch
bin/replace_url.sh $current_branch

git add src
git ci -am "Updates static"
echo "Committed static"
# set current branch in a variable and then push against it
current_branch=$(git branch | grep \* | cut -d ' ' -f2)
git push origin $current_branch
echo "Pushed last changes to $current_branch"

