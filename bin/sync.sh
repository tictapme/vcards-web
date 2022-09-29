#!/bin/bash
rsync -avz --exclude='.git/' --exclude='404.html' --exclude='bin/' debian@51.83.111.98:/home/debian/docker-wp/generated_vcards/ src/ --delete
node bin/add-absolute-url-sitemap.js
