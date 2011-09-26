/*!
 * lam
 * Copyright(c) 2011 Mike Cantelon <mcantelon@gmail.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

var fs = require('fs')
  , exec = require('child_process').exec
  , helpers = require('./helpers')
  , _ = require('underscore');

exports.usage = function(commands) {

  var syntax;

  console.log('Usage:');
  console.log('  lam <package>');

  for(var command in commands) {
    syntax = commands[command].syntax;
    for(var index in syntax) {
      console.log('  lam ' + syntax[index]);
    }
  }
}

exports.getRegistry = function(cb) {

  var home = process.env.HOME
    , registryFile;

  if (home === undefined) {
    helpers.die('HOME environmental variable not defined.')
  }

  registryFile = home + '/.lam';

  fs.readFile(registryFile, function(err, registryData) {
    cb(err, JSON.parse(registryData));
  });
}

exports.searchData = function(registryData, pattern) {
  var found = {};
  for(var package in registryData) {
    if (package.indexOf(pattern) != -1) {
      found[package] = true;
    }
  }
  return found;
}

exports.search = function(pattern) {

  // download lam registry to RAM
  // search
}

exports.ls = function(pattern) {

  exports.getRegistry(function(err, registry) {
    if (err) throw err;

    // so a search if applicable
    if (pattern != undefined) {
      registry = exports.searchData(registry, pattern);
    }

    for(var package in registry) {
      console.log(package);
    }
  });
}

exports.run = function(package) {

  var port
    , package;

  exports.getRegistry(function(err, registry) {

    if (registry != undefined
      && registry[package] != undefined
      && registry[package].start != undefined
    ) {

      package = registry[package];

      port = (package.port != undefined)
        ? package.port
        : helpers.getFreePort();

      exports.runPackage(package, port);

    } else {

      helpers.die("Can't find that package in registry.");
    }
  });
}

exports.runPackage = function(package, port) {

  var command = package.start.replace(
    '{port}', port
  );

  var run = exec(command, {env: process.env})
    , running = false;

  run.stdout.on('data', function(data) {
    console.log(data.toString());

    if (!running) {
      running = true;
      exec('open http://127.0.0.1:' + port, {env: process.env});
    }
  });

  run.stderr.on('data', function(data) {
    console.log(data.toString());
  });
}

exports.discover = function() {

  var tempFile = '/tmp/npm.json';

  console.log('Downloading...');
  // download main npm registry and store local web app data
  exports.downloadNpmData(tempFile, function() {
    console.log('Download complete.');
    fs.readFile(tempFile, function(err, data) {
      if (err) throw err;
      fs.writeFile(
        process.env.HOME + '/.lam',
        JSON.stringify(exports.parseNpmData(data)),
        'utf8',
        function(err) {
          if (err) throw err;
          console.log('Updated.');
        }
      );
    });
  });
}

exports.download = function() {

  // download main npm registry and display local web app data from it
  exports.downloadNpmData('/tmp/npm.json', function(tempFile) {
    fs.readFile(tempFile, function(err, data) {
      if (err) throw err;
      console.log(exports.parseNpmData(data));
    });
  });
}

exports.test = function() {

  fs.readFile('/tmp/npm.json', function(err, data) {
    if (err) throw err;
    fs.writeFile(
      process.env.HOME + '/.lam',
      exports.parseNpmData(data),
      'utf8',
      function(err) {
        if (err) throw err;
        console.log('Updated.');
      }
    );
  });
}

exports.downloadNpmData = function(file, cb) {

  helpers.downloadFile('http://isaacs.iriscouch.com/registry/_all_docs?include_docs=true', file, cb);
}

exports.parseNpmData = function(data) {

  var registry = JSON.parse(data)
    , localRegistry = {}
    , rows = registry.rows
    , package
    , localData

  // look for packages that have "local" set in their package.json
  for(var index in rows) {
    package = rows[index];

    // if a package has versions, check if the latest version has local
    // web app metadata
    if (
      package.id != ''
      && package.doc != undefined
      && package.doc['dist-tags'] != undefined
    ) {
      localData = exports.parsePackageLocalData(package);

      // add local web app metadata to local registry
      if (localData) {
        localRegistry[package.id] = localData;
      }
    }
  }

  return localRegistry;
}

exports.parsePackageLocalData = function(package) {

  var latestVersionNum
    , latestVersion;

  latestVersionNum = package.doc['dist-tags'].latest;

  // if versions exist, look for local web app data in latest version
  if (!_.isEmpty(package.doc.versions)) {
    latestVersion = package.doc.versions[latestVersionNum];

    if (latestVersion.local != undefined) {
      return latestVersion.local;
    }
  }

  return false;
}

exports.version = function() {

  var package_json = fs.readFileSync(__dirname + '/../package.json')
  var package_data = JSON.parse(package_json)

  console.log('lam version ' + package_data.version);
}
