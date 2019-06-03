'use strict';

const base = process.env.BASE_URL || 'http://' + process.env.HOSTNAME + '/';
const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';

const utils = require('../utils/writer.js');

const Feed = require('feed').Feed;

const Parser = require('rss-parser');
let parser = new Parser();

// const Redis = require('ioredis');
// let redis = new Redis(redisPort, redisHost);

let feedIds = [];
let feedsMap = {}; {
  let feed_id = 'reddit';
  let feed = {
    "feed_id": feed_id,
    "url": 'https://www.reddit.com/.rss',
    // "url": 'https://www.lifehacker.jp/feed/index.xml',
    "image_url": "string",
    "description": "string"
  };
  feedIds.push(feed_id);
  feedsMap[feed_id] = feed;
}


/**
 *
 * body Feed 
 * no response value expected for this operation
 **/
exports.createFeed = function (body) {
  return new Promise(function (resolve, reject) {
    console.log('create');
    let feed_id = body.feed_id;
    redis.multi().keys().then((results) => {
      if (feedsMap[feed_id]) {
        let response = utils.respondWithCode(400, {
          code: 400
        });
        reject(response);
      } else {
        feedIds.push(feed_id);
        feedsMap[feed_id] = body;
        let response = utils.respondWithCode(201, {
          code: 201
        });
        resolve(response);

        // redis.set(feed_id, body).exec().then((result) => {
        //   console.log(result);
        // }).catch((err) => {
        //   console.log(err);
        //   let response = utils.respondWithCode(500, {
        //     code: 500
        //   });
        //   reject(response);
        // });
      }
    })
  });
}


/**
 *
 * feed_id String 
 * no response value expected for this operation
 **/
exports.deleteFeed = function (feed_id) {
  return new Promise(function (resolve, reject) {
    console.log('delete');
    if (!feedsMap[feed_id]) {
      let response = utils.respondWithCode(404, {
        code: 404
      });
      reject(response);
    } else {
      delete feedIds[feedIds.indexOf(feed_id)];
      delete feedsMap[feed_id];
      let response = utils.respondWithCode(201, {
        code: 201
      });
      resolve(response);
      
      // redis.del(feed_id).then((result) => {
      //   console.log(result);
      // }).catch((err) => {
      //   console.log(err);
      //   let response = utils.respondWithCode(500, {
      //     code: 500
      //   });
      //   reject(response);
      // })
    }
  });
}


/**
 *
 * returns String
 **/
exports.readFeed = function () {
  return new Promise(function (resolve, reject) {
    console.log('read');
    let feeds = [];
    for (let feed_id in feedsMap) {
      feeds.push(feedsMap[feed_id]);
    }
    let response = utils.respondWithCode(200, feeds);
    resolve(response);

    // redis.keys('*').then((results) => {
    // }).catch((err) => {
    //   console.log(err);
    //   let response = utils.respondWithCode(500, {
    //     code: 500
    //   });
    //   reject(response);
    // });
  });
}


/**
 *
 * feed_id String 
 * body Feed 
 * no response value expected for this operation
 **/
exports.updateFeed = function (feed_id, body) {
  return new Promise(function (resolve, reject) {
    console.log('update');
    if (!feedsMap[feed_id]) {
      let response = utils.respondWithCode(404, {
        code: 404
      });
      reject(response);
    } else if (feed_id != body.feed_id) {
      let response = utils.respondWithCode(400, {
        code: 400
      });
      reject(response);
    } else {
      feedsMap[feed_id] = body;
      let response = utils.respondWithCode(201, {
        code: 201
      });
      resolve(response);

      // redis.set(feed_id, body).then((result) => {
      //   console.log(result);
      // }).catch((err) => {
      //   console.log(err);
      //   let response = utils.respondWithCode(500, {
      //     code: 500
      //   });
      //   reject(response);
      // });
    }
  });
}

/**
 *
 * returns String
 **/
exports.rss = function () {
  return new Promise(async function (resolve, reject) {
    let myfeed = new Feed({
      title: "Feeds aggregator API",
      description: "Feeds aggregator API",
      id: base,
      link: base,
      image: base + 'favicon.ico',
      favicon: base + 'favicon.ico',
      copyright: "All rights reserved 2019, " + base,
      feedLinks: {
        atom: base + 'api/feeds/serve'
      }
    });

    for (let feed_id in feedsMap) {
      try {
        let feed = await parser.parseURL(feedsMap[feed_id].url);
        for (let entry of feed.items) {
          myfeed.addItem(entry);
        }
      } finally {

      }
    }

    let response = utils.respondWithCode(200, myfeed.rss2());
    resolve(response);
  });
}