var http = require('http');
var cheerio = require('cheerio');

exports.onConnected = function(client) {
  client.on('message', function(from, to, msg){
    var words = msg.split(/\s+/);
    if (words[0] == '.mlb') {
      var req = http.request('http://m.mlb.com/' + words[1] + '/', function(res){
        var body = '';
        res.on('data', function(data){
          body += data.toString();
        }).on('end', function(){
          if (res.statusCode != '200') {
            client.say(to, "Error. Try one of: ari atl bal bos chc cin cle col cws det hou kc laa lad mia mil min nym nyy oak phi pit sd sea sf stl tb tex tor wsh");
          } else {
            var $ = cheerio.load(body);
            var answer = $('#scoreboard_module .games').slice(0, 1).text().replace(/\s+/g, ' ');
            client.say(to, answer);
          }
        }).on('error', function(){
          client.say(to, 'errored');
        });
      });
      req.end();
    }
  });
}