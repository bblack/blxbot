var irc = require('irc');
var fs = require('fs');

var client;

var modules = {};
var self = this;
fs.readdirSync('./modules').forEach(function(file) {
  modules[file] = require('./modules/' + file);
  console.log('loaded module ' + file);
  if (modules[file].bindToBot) {
    modules[file].bindToBot(self);
  }
});

exports.modules = modules;

exports.connect = function(opts){
  if (client) { throw "Already connected."; }
  client = new irc.Client(opts.server, opts.nick, opts);
  for (filename in modules) {
    modules[filename].onConnected(client);
    console.log('bound module ' + filename + ' to client.')
  }
}