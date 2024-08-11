#!/bin/bash
echo "Building backend"

# build or up 파라미터 받기
if [ "$1" == "build" ]; then
    echo "Building backend"
    docker-compose -f docker-compose.yml build
elif [ "$1" == "up" ]; then
    echo "Starting backend"
    if [ "$2" == "dev" ]; then
        echo "Starting backend in development mode"
        NODE_ENV=development docker-compose --env-file .env.dev -f docker-compose.yml  up -d
    else
        echo "Starting backend in production mode"
        NODE_ENV=production docker-compose -f docker-compose.yml up -d
    fi
    #docker-compose -f docker-compose.yml up -d
else
    echo "Invalid parameter"
fi
