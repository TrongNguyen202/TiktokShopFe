#!/bin/bash

SESSION_NAME="backend"

# Check if the tmux session named 'backend' already exists
if tmux has-session -t $SESSION_NAME 2>/dev/null; then
    echo "Backend tmux session already exists. Killing it."
    tmux kill-session -t $SESSION_NAME
fi

# Create a new backend tmux session
echo "Creating new backend tmux session."
tmux new-session -d -s $SESSION_NAME

# Send the command to start the server to the tmux session
tmux send-keys -t $SESSION_NAME "source .venv/bin/activate" C-m

# Send the command to start the server to the tmux session
tmux send-keys -t $SESSION_NAME "python manage.py runserver" C-m

