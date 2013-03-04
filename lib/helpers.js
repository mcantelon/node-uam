/*!
 * uam
 * Copyright(c) 2011 Mike Cantelon <mcantelon@gmail.com>
 * MIT Licensed
 */

var dgram = require('dgram')
  , fs = require('fs')
  , request = require('request');

exports.die = function(message) {
  console.log('Error: ' + message);
  process.exit(1);
}

exports.getFreePort = function(cb) {
  var server = dgram.createSocket("udp4");
  server.bind(0, "localhost");
  server.on('listening', function() {
    var port = server.address().port;
    server.close();
    cb(port);
  });
}

exports.getUserHome = function() {
  var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

  if (home === undefined) {
    exports.die('HOME or USERPROFILE environmental variable not defined.')
  }

  return home;
}

exports.downloadFile = function(url, file, cb) {
  var download = request(url);
  download.pipe(fs.createWriteStream(file))
  download.on('end', function() {
    cb(file);
  });
}
