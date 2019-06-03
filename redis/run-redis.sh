#!/bin/sh

DIR=$(cd $(dirname ${BASH_SOURCE:-$0}); pwd)
cd ${DIR}

sudo -E docker pull redis:5.0
sudo -E docker stop feeds-redis
sudo -E docker rm feeds-redis
sudo -E docker run --name feeds-redis --net=host -d \
 -v ${DIR}/data:/data \
 redis:5.0 \
 redis-server --appendonly yes

sudo -E docker run --rm --net=host -it \
 redis:5.0 \
 redis-cli -h 127.0.0.1 -p 6379

