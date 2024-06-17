#!/bin/bash

# Set default values for URLs
DEFAULT_OLD_URL="static-www-vcards.tictap.me"
DEFAULT_NEW_URL="vcards.tictap.me"

# If first argument is "develop" then set the default values to the develop environment
if [ "$1" == "develop" ]; then
  DEFAULT_OLD_URL="static-www-vcards\\.tictap\\.me"
  DEFAULT_NEW_URL="develop.vcards-web.pages.dev"
fi

if [ "$1" == "main" ]; then
  DEFAULT_OLD_URL="static-www-vcards\\.tictap\\.me|develop\\.vcards-web\\.pages\\.dev"
  DEFAULT_NEW_URL="vcards.tictap.me"
fi

# Check if the correct number of arguments are provided
if [ "$#" -lt 1 ] || [ "$#" -gt 3 ]; then
  echo "Usage: $0 [old_url] [new_url]"
  exit 1
fi

# Assign arguments to variables
SRC_DIR="src/"
OLD_URL="${2:-$DEFAULT_OLD_URL}"
NEW_URL="${3:-$DEFAULT_NEW_URL}"

# Check if the provided directory exists
if [ ! -d "$SRC_DIR" ]; then
  echo "Directory $SRC_DIR does not exist"
  exit 1
fi

# Find all files in the src directory and process them
find "$SRC_DIR" -type f | while read -r file; do
  # Use sed to replace the URL and save changes in place
  sed -i -E "s/$OLD_URL/$NEW_URL/g" "$file"
  echo "Processed $file"
done

echo "Replaced URLs from $OLD_URL to $NEW_URL in $SRC_DIR"
