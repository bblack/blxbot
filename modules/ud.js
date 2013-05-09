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
          body += data.toString();
        }).on('end', function(){
          if (res.statusCode != '200') {
            client.say(to, "Error. Received " + res.statusCode);
          } else {
            var $ = cheerio.load(body);
            var table_entries = $('table#entries');
            if (table_entries.length == 0) {
              client.say(to, "Couldn't find a definition for " + term);
            } else {
              var def_word = $('table#entries td.word span').slice(0, 1).text().replace(/\n/g, '');
              var def = $('table#entries div.definition').slice(0, 1).text().replace(/\s+/g, ' ');
              def = def.slice(0, 300);
              client.say(to, def_word + ": " + def);
            }
          }
        }).on('error', function(){
          client.say(to, 'errored');
        });
      });
      req.end();
    }
  });
}