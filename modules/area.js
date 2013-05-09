var http = require('http');
var cheerio = require('cheerio');
var Mustache = require('mustache');

exports.onConnected = function(client) {
  client.on('message', function(from, to, msg){
    var words = msg.split(/\s+/);
    if (words[0] == '.area') {
      var code = words[1];
      var url = 'http://www.allareacodes.com/' + code
      var req = http.request(url, function(res){
        var body = '';
        res.on('data', function(data){
          body += data.toString();
        }).on('end', function(){
          if (res.statusCode != '200') {
            client.say(to, "Error. Received " + res.statusCode);
          } else {
            var $ = cheerio.load(body);
            var details_table = $('table.npa_details');
            var state_text = details_table.find('tr').slice(1, 2).find('td').slice(1, 2).text();
            var city_text = details_table.find('tr').slice(2, 3).find('td').slice(1, 2).text();
            var response = Mustache.render("Area code {{code}}: {{city}}, {{state}}", {
              code: code,
              city: city_text,
              state: state_text
            });
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