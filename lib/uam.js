/*!
 * uam
 * Copyright(c) 2011 Mike Cantelon <mcantelon@gmail.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

var fs = require('fs')
  , os = require('os')
  , path = require('path')
  , exec = require('child_process').exec
  , helpers = require('./helpers')
  , _ = require('underscore')
  , open = require('open')
  , homeDir = require('home-dir')
  , npmconf = require('npmconf')
  , freeport = require('freeport');

exports.usage = function(commands) {
  var syntax;

  console.log('Usage:');
  console.log('  uam <package>');

  for(var command in commands) {
    syntax = commands[command].syntax;
    for(var index in syntax) {
      console.log('  uam ' + syntax[index]);
    }
  }
}

exports.uninstall = function(package) {
  exports.loadRegistry(function(err, registry) {
    if (err) throw err;

    if (registry[package] != undefined) {
      console.log('Removing...'
        + ' you may be prompted to enter a superuser password.');
      var run = exec('sudo npm rm -g ' + package, {env: process.env})

      run.stdout.on('data', function(data) {
        console.log(data.toString());
      });

      run.stderr.on('data', function(data) {
        console.log(data.toString());
      });

      run.on('exit', function(code) {
        console.log('Removing from local app inventory...');
        exports.getRegistry(function(err, userRegistry) {
          if (err) throw err;
          delete userRegistry[package];
          fs.writeFile(
            path.join(homeDir(), '.uam'),
            JSON.stringify(userRegistry),
            'utf8',
            function(err) {
              if (err) throw err;
              console.log('Removal complete.');
            }
          );
        });
      });

    } else {
      console.log('Package not found.');
    }
  });
}

exports.install = function(package) {
  exports.loadRegistry(function(err, registry) {
    if (err) throw err;

    if (registry[package] != undefined) {
      console.log('Installing globally...'
        + ' you may be prompted to enter a superuser password.');
      var run = exec('sudo npm install -g ' + package, {env: process.env})

      run.stdout.on('data', function(data) {
        console.log(data.toString());
      });

      run.stderr.on('data', function(data) {
        console.log(data.toString());
      });

      run.on('exit', function(code) {
        console.log('Adding to local app inventory...');
        exports.getRegistry(function(err, userRegistry) {
          if (err) throw err;
          userRegistry[package] = registry[package];
          fs.writeFile(
            path.join(homeDir(), '.uam'),
            JSON.stringify(userRegistry),
            'utf8',
            function(err) {
              if (err) throw err;
              console.log('Installation complete.');
              exports.run(package);
            }
          );
        });
      });

    } else {
      console.log('Package not found.');
    }
  });
}

exports.getRegistry = function(cb) {
  var home = homeDir()
    , registryFile;

  registryFile = path.join(home, '.uam');

  fs.exists(registryFile, function(exists) {
    if (!exists) {
      cb(false, {});
    } else {
      fs.readFile(registryFile, function(err, registryData) {
        cb(err, JSON.parse(registryData));
      });
    }
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
  exports.loadRegistry(function(err, registry) {
    if (err) throw err;
    exports.lsOrSearchOutput(registry, pattern);
  });
}

exports.ls = function(pattern) {
  exports.getRegistry(function(err, registry) {
    if (err) throw err;
    exports.lsOrSearchOutput(registry, pattern);
  });
}

exports.lsOrSearchOutput = function(registry, pattern) {
  // so a search if applicable
  if (pattern != undefined) {
    registry = exports.searchData(registry, pattern);
  }

  for(var package in registry) {
    console.log(package);
  }
}

exports.run = function(package) {
  var port
    , package;

  exports.getRegistry(function(err, registry) {
    if (registry != undefined
      && registry[package] != undefined
      && registry[package].uam != undefined
      && registry[package].uam.start != undefined
    ) {

      package = registry[package];

      if (package.port != undefined) {
        exports.runPackage(package, port);
      } else {
        freeport(function (err, port) {
          exports.runPackage(package, port);
        });
      }

    } else {
      helpers.die("Can't find that package in registry.");
    }
  });
}

exports.runPackage = function(package, port) {
  // allow option of having port supplied as a CLI argument
  var command = package.uam.start.replace(
    '{port}', port
  );

  // allow option of having port specified as an env variable
  command = 'PORT=' + port + ' ' + command

  var run = exec(command, {env: process.env})
    , running = false
    , openCommand;

  // open browser when local web application outputs text
  run.stdout.on('data', function(data) {

    console.log(data.toString());

    if (!running) {
      running = true;
      open('http://127.0.0.1:' + port);
    }
  });

  run.stderr.on('data', function(data) {
    console.log(data.toString());
  });
}

exports.loadRegistry = function(cb) {
  var tempFile = path.join(os.tmpDir(), 'uam.json');

  // download uam npm registry and parse
  exports.downloadNpmData(tempFile, function() {
    fs.readFile(tempFile, function(err, fullRegistryData) {
      cb(err, JSON.parse(fullRegistryData));
    });
  });
}

exports.downloadNpmData = function(file, cb) {
  npmconf.load({}, function (err, conf) {
    helpers.downloadFile(
      conf.get('registry') + '-/by-field?field=uam',
      file,
      cb
    );
  });
}

exports.version = function() {

  var package_json = fs.readFileSync(path.join(__dirname, '..', 'package.json'))
  var package_data = JSON.parse(package_json)

  console.log('uam version ' + package_data.version);
}
