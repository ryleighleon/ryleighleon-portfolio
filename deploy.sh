#!/bin/bash

# run this first: 'chmod +x deploy.sh'

# Add all modified files to the staging area
git add -A

# Prompt user for commit message
read -p "Enter commit message: " commitMessage

# Commit changes with the provided message
git commit -m "$commitMessage"

# Push changes to GitHub
git push

# Run npm run deploy
npm run deploy
