#!/bin/bash

set -e

FOLDER=$1
BRANCH_NAME="${2:-main}"
GITHUB_USERNAME="natemoo-re"
DEST_ORG="natemoo-re"
STARTER_NAME="${3:-template}"
BASE=$(pwd)

git config --global user.email "actions@github.com"
git config --global user.name "$GITHUB_USERNAME"

echo "Cloning folders in $FOLDER and pushing to $DEST_ORG"
echo "Using $STARTER_NAME as the package.json key"

# sync to read-only clones
for folder in $FOLDER/*; do
  [ -d "$folder" ] || continue # only directories
  cd $BASE

  echo "$folder"

  NAME=$(cat $folder/package.json | jq --arg name "$STARTER_NAME" -r '.[$name]')
  echo "  Name: $NAME"
  CLONE_DIR="__${NAME}__clone__"
  echo "  Clone dir: $CLONE_DIR"

  # clone, delete files in the clone, and copy (new) files over
  # this handles file deletions, additions, and changes seamlessly
  git clone --depth 1 https://$API_TOKEN_GITHUB@github.com/$DEST_ORG/$NAME.git $CLONE_DIR &> /dev/null
  cd $CLONE_DIR
  find . | grep -v ".git" | grep -v "^\.*$" | xargs rm -rf # delete all files (to handle deletions in monorepo)
  cp -r $BASE/$folder/. .


  # Commit if there is anything to
  if [ -n "$(git status --porcelain)" ]; then
    echo  "  Committing $NAME to $GITHUB_REPOSITORY"
    git add .
    git commit --message "Update $NAME from $GITHUB_REPOSITORY"
    git push origin $BRANCH_NAME
    echo  "  Completed $NAME"
  else
    echo "  No changes, skipping $NAME"
  fi

  cd $BASE
done
