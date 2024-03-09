#!/bin/bash

# Check if the tmux session name backend exists
if tmux has-session -t backend; then
    # If it does, kill it
    tmux kill-session -t backend
fi 
# If it does not exist, create it
tmux new-session -d -s backend

# Send the command to start the server to the tmux session
tmux send-keys -t backend "pwd" C-m

