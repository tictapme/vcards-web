#!/bin/bash
git add src 
git ci -am "Updates static"
echo "Committed static"
# set current branch in a variable and then push against it
current_branch=$(git branch | grep \* | cut -d ' ' -f2)
git push origin $current_branch
echo "Pushed last changes to $current_branch"

