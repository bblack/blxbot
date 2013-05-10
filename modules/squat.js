var handle;
var desiredNick = 'bblack';

var switchOn = function(client, chan) {
  if (handle) { 
    client.say(chan, 'squat already on');
    return;
  }
  handle = setInterval(tryGrabNick, 3000, client);
  client.say(chan, 'squat switched on');
}

var switchOff = function(client, chan) {
  handle = clearInterval(handle);
  client.say(chan, 'squat switched off');
}

var tryGrabNick = function(client) {
  // we would just do this and then return:
  //
  // client.send("NICK", desiredNick);
  //
  // However, the stupid irc.js is wired to send a new NICK whenever it
  // gets a message from the server that its last nick change failed.
  // So we'll do this instead:
  client.whois(desiredNick, function(info){
    if (JSON.stringify(info) == JSON.stringify({nick: desiredNick})) {
      // a whois callback that's passed a hash with only a 'nick' key implies
      // no user matched the whois. ergo the desired nick is free
      client.send("NICK", desiredNick);
    }
  });
}

exports.onConnected = function(client) {
  client.on('message', function(from, to, text, msg){
    var words = text.split(/\s+/);
    if (words[0] == '.squat') {
      if (words[1] == 'on') {
        switchOn(client, to);
      } else if (words[1] == 'off') {
        switchOff(client, to);
      }
    }
  });
  client.on('error', function(msg){
    if (msg.command == 'err_nosuchnick' && msg.args[1] == desiredNick) {
      // irc.js decides to emit an 'error' event on err_nosuchnick.
      // don't know why. anyway, handling it here means that all 'error' events
      // are now caught. lolirc.js
    } else {
      // squat.js is catching error events, but only because err_nosuchnick
      // is an expected message for us sometimes. but in doing this,
      // we have to catch all error events, even the ones we don't care about.
      // so we'll report the ones we ate but didn't care about.
      console.log('got an error: ' + JSON.stringify(args));
    }
  });
}