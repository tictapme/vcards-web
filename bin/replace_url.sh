#!/bin/bash

# Set default values for URLs
DEFAULT_OLD_URL="static-www-vcards.tictap.me"
DEFAULT_NEW_URL="vcards.tictap.me"

# Check if the correct number of arguments are provided
if [ "$#" -lt 1 ] || [ "$#" -gt 3 ]; then
  echo "Usage: $0 src_dir [old_url] [new_url]"
  exit 1
fi

# Assign arguments to variables
SRC_DIR="$1"
OLD_URL="${2:-$DEFAULT_OLD_URL}"
NEW_URL="${3:-$DEFAULT_NEW_URL}"


SRC_DIR="$1"

# Check if the provided directory exists
if [ ! -d "$SRC_DIR" ]; then
  echo "Directory $SRC_DIR does not exist"
  exit 1
fi

# Find all files in the src directory and process them
find "$SRC_DIR" -type f | while read -r file; do
  # Use sed to replace the URL and save changes in place
  sed -i "s|$OLD_URL|$NEW_URL|g" "$file"
  echo "Processed $file"
done
