var self = this;

exports.bindToBot = function(bot) {
  self.bot = bot;
}

exports.onConnected = function(client) {
  client.on('message', function(from, to, text, msg){
    var words = text.split(/\s+/);
    var prefix = msg.prefix;
    if (words[0] == '.admin') {
      if (self.bot.modules['admin.js'].isAdmin(prefix)) {
        client.say(to, "You, " + prefix + ", are an admin");
      } else {
        client.say(to, "You, " + prefix + ", are not an admin");
      }
    }
  });
}