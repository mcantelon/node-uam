#!/usr/bin/env node

/*!
* uam
* Copyright(c) 2011 Mike Cantelon
* MIT Licensed
*/

var mingy = require('mingy')
  , Parser = mingy.Parser
  , argv = require('optimist').argv
  , uam = require('../lib/uam.js')
  , commands;

commands = {

  'run': {
    'syntax': ['run <package>'],
    'logic': function(args) {
      uam.run(args['package']);
      return true;
    }
  },

  'install': {
    'syntax': ['install <package>'],
    'logic': function(args) {
      uam.install(args['package']);
      return true;
    }
  },

  'rm': {
    'syntax': ['rm <package>'],
    'logic': function(args) {
      uam.uninstall(args['package']);
      return true;
    }
  },

  'help': {
    'syntax': ['help'],
    'logic': function() {
      uam.usage(commands);
      return true;
    }
  },

  'search': {
    'syntax': ['search', 'search <pattern>'],
    'logic': function(args) {
      uam.search(args['pattern']);
      return true;
    }
  },

  'ls': {
    'syntax': ['ls', 'ls <pattern>'],
    'logic': function(args) {
      if (args['pattern'] != undefined) {
        uam.ls(args['pattern']);
      } else {
        uam.ls();
      }
      return true;
    }
  },

  'version': {
    'syntax': ['version'],
    'logic': function() {
      uam.version();
      return true;
    }
  }
}

parser = new Parser(commands)

if (!parser.parseLexemes(argv['_'])) {
  if (argv['_'].length == 1) {
    uam.run(argv['_'].pop());
  } else {
    console.log('Unrecognized command.\n');
    parser.parse('help');
  }
}
