#!/bin/bash
echo "Building backend"

# build or up 파라미터 받기
if [ "$1" == "build" ]; then
    echo "Building backend"
    docker-compose -f docker-compose.yml build
elif [ "$1" == "up" ]; then
    echo "Starting backend"
    docker-compose -f docker-compose.yml up -d
else
    echo "Invalid parameter"
fi
