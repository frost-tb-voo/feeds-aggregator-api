#!/bin/sh

DIR=$(cd $(dirname ${BASH_SOURCE:-$0}); pwd)
cd ${DIR}

export PORT=8080
export BASE_URL=http://localhost:8080/

cd nodejs-server-server
yarn add rss-parser feed cors ioredis
npm audit fix
npm audit fix
npm start

