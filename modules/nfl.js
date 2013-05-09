var http = require('http');
var cheerio = require('cheerio');

exports.onConnected = function(client) {
  client.on('message', function(from, to, msg){
    var words = msg.split(/\s+/);
    if (words[0] == '.nfl') {
      var url = 'http://m.espn.go.com/nfl/scoreboard?';
      var req = http.request(url, function(res){
        var body = '';
        res.on('data', function(data){
          body += data.toString();
        }).on('end', function(){
          if (res.statusCode != '200') {
            client.say(to, "Error. Received " + res.statusCode);
          } else {
            var $ = cheerio.load(body);
            var abv = words[1].toUpperCase();
            var abv_el = $('.competitor-name').find("*").filter(function(i,e){
              return $(e).text() == abv;
            });
            if (abv_el.length == 0) {
              client.say(to, "Couldn't find a team with that abbreviation this week. Abbreviations are 3 letters (sometimes 2) that name the team's hometown.")
              return;
            }
            var game_el = abv_el.parents("table.match");
            var game_text = game_el.find("*").filter(function(i,e){
              return $(e).children().length == 0;
            }).map(function(i,e){
              return $(e).text();
            }).join(' ').replace(/\s+/g, ' ');
            var day = game_el.parents('div.daysgames').find('div.day-head.column-head').text();
            var response = day + ' ' + game_text;
            client.say(to, response);
          }
        }).on('error', function(){
          client.say(to, 'errored');
        });
      });
      req.end();
    }
  });
}