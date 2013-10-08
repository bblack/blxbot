var http = require('http');
var cheerio = require('cheerio');

exports.onConnected = function(client) {
  client.on('message', function(from, to, msg){
    var words = msg.split(/\s+/);
    if (words[0] == '.ud') {
      var term = words.slice(1).join(' ');
      var url = 'http://www.urbandictionary.com/define.php?term=' + encodeURIComponent(term);
      var req = http.request(url, function(res){
        var body = '';
        res.on('data', function(data){
          body += data;
        }).on('end', function(){
          if (res.statusCode != '200') {
            client.say(to, "Error. Received " + res.statusCode);
          } else {
            try {
              var $ = cheerio.load(body);
              var def_word = $('#entries .word span').slice(0,1).text().replace(/\n/g, '');
              var def = $('#entries .text .definition').slice(0,1).text().replace(/\s+/g, ' ');
              def = def.slice(0, 300);
              client.say(to, def_word + ": " + def);
            } catch (ex) {
              client.say(to, "couldn't get definition for " + term);
            }
          }
        });
      });
      req.on('error', function(err){
          client.say(to, 'errored: ' + err);
      });
      req.end();
    }
  });
}
