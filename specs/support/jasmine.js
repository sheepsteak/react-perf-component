require('babel/register');
var injectr = require('injectr');

injectr.onload = function(filename, contents) {
  return require('babel').transform(contents, {
    filename: filename
  }).code;
};

process.env.JASMINE_CONFIG_PATH = 'specs/support/jasmine.json';

var path = require('path');
var Command = require('jasmine/lib/command.js');
var command = new Command(path.resolve());

var Jasmine = require('jasmine/lib/jasmine.js');
var jasmine = new Jasmine({ projectBaseDir: path.resolve() });

command.run(jasmine, process.argv.slice(2));
