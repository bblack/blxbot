var net = require('net');
var client;

exports.connect = function(opts){
  client = net.connect({
    host: opts.host,
    port: opts.port,
    nick: opts.nick
  })
}