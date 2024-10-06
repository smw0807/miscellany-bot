#!/bin/bash
echo "Building frontend"

# build or up 파라미터 받기
if [ "$1" == "build" ]; then
    echo "Building frontend"
    docker-compose -f docker-compose.yml build
    #docker buildx build --platform linux/amd64 -t miscellany-fe .
elif [ "$1" == "up" ]; then
    echo "Starting frontend"
    docker-compose -f docker-compose.yml up -d
else
    echo "Invalid parameter"
fi

#docker build -t miscellay-fe:0.0.13 .
#docker run -d --env-file ./.env --name miscellany-fe -p 3000:3000 miscellay-fe:0.0.13