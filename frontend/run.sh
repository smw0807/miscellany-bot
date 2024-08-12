#!/bin/bash
echo "Building frontend"

# build or up 파라미터 받기
if [ "$1" == "build" ]; then
    echo "Building frontend"
    docker-compose -f docker-compose.yml build --no-cache
elif [ "$1" == "up" ]; then
    echo "Starting frontend"
    docker-compose -f docker-compose.yml up -d
else
    echo "Invalid parameter"
fi