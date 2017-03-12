let Botkit = require('botkit');

let clientId = process.env.CLIENTID;
let clientSecret = process.env.CLIENT_SECRET;

let controller = Botkit.slackbot();

controller.spawn({
    token:process.env.TOKEN
}).startRTM();

controller.hears('hello',['direct_message', 'direct_mention', 'mention'], function(bot, message) {
    bot.reply(message, 'Hello Yourself.');
});

