/*!
 * uam
 * Copyright(c) 2011 Mike Cantelon <mcantelon@gmail.com>
 * MIT Licensed
 */

var fs = require('fs')
  , request = require('request');

exports.die = function(message) {
  console.log('Error: ' + message);
  process.exit(1);
}

exports.downloadFile = function(url, file, cb) {
  var download = request(url);
  download.pipe(fs.createWriteStream(file))
  download.on('end', function() {
    cb(file);
  });
}
