require('babel-core/register');
var injectr = require('injectr');

injectr.onload = function(filename, contents) {
  return require('babel-core').transform(contents, {
    filename: filename
  }).code;
};
