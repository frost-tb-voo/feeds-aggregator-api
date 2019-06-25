'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.createFeed = function createFeed (req, res, next) {
  var body = req.swagger.params['body'].value;
  Default.createFeed(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteFeed = function deleteFeed (req, res, next) {
  var feed_id = req.swagger.params['feed_id'].value;
  Default.deleteFeed(feed_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.readFeed = function readFeed (req, res, next) {
  Default.readFeed()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.rss = function rss (req, res, next) {
  Default.rss()
    .then(function (response) {
      // utils.writeJson(res, response);
      res.writeHead(response.code, {'Content-Type': 'application/rss+xml'});
      res.end(response.payload);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.sync = function sync (req, res, next) {
  Default.sync()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateFeed = function updateFeed (req, res, next) {
  var feed_id = req.swagger.params['feed_id'].value;
  var body = req.swagger.params['body'].value;
  Default.updateFeed(feed_id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
