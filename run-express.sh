#!/bin/sh

DIR=$(cd $(dirname ${BASH_SOURCE:-$0}); pwd)
cd ${DIR}

export PORT=8080
export BASE_URL=http://localhost:8080/
export REDIS_PORT=
export REDIS_HOST=

cd nodejs-server-server
npm install
npm audit fix
npm cache clean
rm -r node_modules package-lock.json 
yarn add rss-parser feed cors ioredis dotenv
yarn install
npm start

