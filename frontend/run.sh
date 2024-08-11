#!/bin/bash
echo "Building frontend"

# build or up 파라미터 받기
if [ "$1" == "build" ]; then
    echo "Building frontend"
    docker-compose -f docker-compose.yml build
elif [ "$1" == "up" ]; then
    echo "Starting frontend"
    if [ "$2" == "dev" ]; then
        echo "Starting frontend in development mode"
        NODE_ENV=development docker-compose --env-file .env.dev -f docker-compose.yml  up -d
    else
        echo "Starting frontend in production mode"
        NODE_ENV=production docker-compose -f docker-compose.yml up -d
    fi
    #docker-compose -f docker-compose.yml up -d
else
    echo "Invalid parameter"
fi