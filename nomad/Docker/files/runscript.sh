#!/bin/bash

# Start the first process
service mongodb restart
mongo --eval "db.getSiblingDB('admin').addUser('admin', 'admin');"

status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start my_first_process: $status"
  exit $status
fi

# Start the second process
echo "mongo stuff done"
service nginx restart

echo "nginx service restarted"

status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start my_second_process: $status"
  exit $status
fi

# Start the main nodejs server
cd /checkbox.io/server-side/site
forever start server.js
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start forever start server.js : $status"
  exit $status
fi

echo "forever server started"

ls /checkbox.io/public_html/

# Naive check runs checks once a minute to see if either of the processes exited.
# This illustrates part of the heavy lifting you need to do if you want to run
# more than one service in a container. The container will exit with an error
# if it detects that either of the processes has exited.
# Otherwise it will loop forever, waking up every 60 seconds

while /bin/true; do
  ps aux |grep mongodb |grep -q -v grep
  PROCESS_1_STATUS=$?
  ps aux |grep nginx |grep -q -v grep
  PROCESS_2_STATUS=$?
  ps aux |grep forever |grep -q -v grep
  PROCESS_3_STATUS=$?
  # If the greps above find anything, they will exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 -o $PROCESS_3_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit -1
  fi
  sleep 60
done