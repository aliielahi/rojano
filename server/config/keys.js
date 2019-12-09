const mongoose = require('mongoose');

const MONGO_USERNAME = 'a.e';
const MONGO_PASSWORD = '44092300';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'rojano';
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

module.exports = {
  // mongoURI: 'mongodb://rojanoback:alielahi123@ds249017.mlab.com:49017/rojano',
  mongoURI: url,
  secretOrkey: String('secret')
};


