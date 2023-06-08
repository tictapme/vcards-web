#!/bin/bash
git add static
git add ./src
git ci -am "Updates static"
git push origin main
