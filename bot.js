var irc = require('irc');
var fs = require('fs');

var client;

var modules = {};
fs.readdirSync('./modules').forEach(function(file) {
  modules[file] = require('./modules/' + file);
  console.log('loaded module ' + file);
});

exports.connect = function(opts){
  if (client) { throw "Already connected."; }
  client = new irc.Client(opts.server, opts.nick, opts);
  for (filename in modules) {
    modules[filename].onConnected(client);
    console.log('bound module ' + filename + ' to client.')
  }
}