#!/usr/bin/env node

/*!
* lam
* Copyright(c) 2011 Mike Cantelon
* MIT Licensed
*/

var mingy = require('mingy')
  , Parser = mingy.Parser
  , argv = require('optimist').argv
  , lam = require('../lib/lam.js')
  , commands;

commands = {

  'run': {
    'syntax': ['run <package>'],
    'logic': function(args) {
      lam.run(args['package']);
      return true;
    }
  },

  'install': {
    'syntax': ['install <package>'],
    'logic': function(args) {
      lam.install(args['package']);
      return true;
    }
  },

  'rm': {
    'syntax': ['rm <package>'],
    'logic': function(args) {
      lam.uninstall(args['package']);
      return true;
    }
  },

  'help': {
    'syntax': ['help'],
    'logic': function() {
      lam.usage(commands);
      return true;
    }
  },

  'search': {
    'syntax': ['search', 'search <pattern>'],
    'logic': function(args) {
      lam.search(args['pattern']);
      return true;
    }
  },

  'ls': {
    'syntax': ['ls', 'ls <pattern>'],
    'logic': function(args) {
      if (args['pattern'] != undefined) {
        lam.ls(args['pattern']);
      } else {
        lam.ls();
      }
      return true;
    }
  },

  'version': {
    'syntax': ['version'],
    'logic': function() {
      lam.version();
      return true;
    }
  }
}

parser = new Parser(commands)

parser.addCommand('test')
.set('syntax', ['test'])
.set('logic', function() {
  lam.test();
})

if (!parser.parseLexemes(argv['_'])) {
  if (argv['_'].length == 1) {
    lam.run(argv['_'].pop());
  } else {
    console.log('Unrecognized command.\n');
    parser.parse('help');
  }
}
