/*!
 * lam
 * Copyright(c) 2011 Mike Cantelon <mcantelon@gmail.com>
 * MIT Licensed
 */

var dgram = require('dgram')
  , request = require('request');

exports.die = function(message) {

  console.log('Error: ' + message);
  process.exit(1);
}

exports.getFreePort = function() {
  var server = dgram.createSocket("udp4");
  server.bind(0, "localhost");
  var port = server.address().port;
  server.close();
  
  return port;
}

exports.downloadFile = function(url, file, cb) {

  var download = request(url);
  download.pipe(fs.createWriteStream(file))
  download.on('end', function() {
    cb(file);
  });
}
