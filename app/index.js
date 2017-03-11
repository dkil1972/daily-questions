let http = require('http');

let clientId = process.env.CLIENTID;
let clientSecret = process.env.CLIENT_SECRET;

let options = {
    host: 'https://slack.com/oauth/authorize', 
    path: '?client_id=' + clientId + '&scope=bot'
};

var callback = function(response) {
    let str = '';
    response.on('data', function(chunk){
        str += chunk;
    });

    response.on('end', function() {
        console.log(str);
    });
};

http.request(options, callback).end();

console.log(clientId + ' : ' + clientSecret);
