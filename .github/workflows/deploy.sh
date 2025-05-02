#!/bin/bash

# Variables
HOST="$FTP_HOST"
USERNAME="$FTP_USER"
PASSWORD="$FTP_PASSWORD"

# Base remote directory
BASE_REMOTE="mime"

# Directories to replicate and upload
declare -a DIRECTORIES=("app/html" "app/src")
declare -a DIST=("./dist/*")

# Install sshpass for non-interactive ssh login (if not already installed)
if ! command -v sshpass &> /dev/null
then
    echo "sshpass could not be found, installing..."
    sudo apt-get update && sudo apt-get install -y sshpass
fi

upload_dist() {
  local dir=$1
  local base=$(basename "$dir")

  echo "mkdir $BASE_REMOTE"
  echo "cd $BASE_REMOTE"
  echo "put -r $dir"
}

upload_directory() {
    local dir=$1
    local base=$(basename "$dir")

    echo "cd /" # Reset to root directory
    echo "cd $BASE_REMOTE" # Go into mime folder

    # Create and enter into the corresponding remote directory
    echo "mkdir $base" # create directory in mime folder, named after the base directory
    echo "cd $base" # enter into the directory

    # Upload all files from the directory to the remote server
    find "$dir" -type f | while IFS= read -r file; do # Read all files in the directory
        local subdir=$(dirname "$file") # Get the subdirectory of the file
        local relative_subdir="${subdir##*/}" # Get the relative subdirectory
        local filename=$(basename "$file") # Get the filename


        if [ "$subdir" != "$dir" ]; then # If file is not in the base directory
            echo "mkdir \"$relative_subdir\"" # Create the subdirectory in the remote server
            echo "cd \"$relative_subdir\"" # Enter into the subdirectory
            echo "put \"$file\" \"$filename\"" # Upload the file to the subdirectory
            echo "cd .." # Reset to base directory for each file
        fi

        if [ "$subdir" === "$dir" ]; then 
            echo "put \"$file\" \"$filename\"" # Upload the file to the base directory
        fi
    done
}

# Start SFTP session
sshpass -p $PASSWORD sftp -oBatchMode=no -oStrictHostKeyChecking=no $USERNAME@$HOST <<EOF
$(for dir in "${DIST[@]}"; do upload_dist "$dir"; done)
$(for dir in "${DIRECTORIES[@]}"; do upload_directory "$dir"; done)
bye
EOF