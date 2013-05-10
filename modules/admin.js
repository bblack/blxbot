try {
  var _ = require('underscore');
} catch (err) {
  var _ = {
    any: function(list, test) {
      for (var i in list) {
        if (test(list[i])) {
          return true;
        }
      }
      return false;
    }
  }
}

var admins = [
  /.+\!.+@not\.mad$/,
  /.+\!.+@localhost$/
]

exports.isAdmin = function(user) {
  return _.any(admins, function(a){
    return !!user.match(a);
  });
}

exports.bindToBot = function(bot) {
  this.bot = bot;
}

exports.onConnected = function(client) {
  
}