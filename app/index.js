let Botkit = require('botkit');

let clientId = process.env.CLIENTID;
let clientSecret = process.env.CLIENT_SECRET;

let controller = Botkit.slackbot();

controller.spawn({
    token:process.env.TOKEN
}).startRTM();

controller.hears('hello',['direct_message', 'direct_mention', 'mention'], function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.ask('hello, would you like to set a goal?', [
        
            {
                pattern: 'yes',
                callback: function(response, convo){
                    convo.say("cool, i'll get back to you soon");
                    convo.next();
                }
            },
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo){
                    convo.say("that's a shame, say hello if you change your mind");
                    convo.next();
                }
            },
            {
                pattern: bot.utterances.no,
                callback: function(response, convo){
                    convo.say("that's a shame, say hello if you change your mind");
                    convo.next();
                }
            },
            {
                default: true,
                callback: function(response, convo){
                    convo.say("I don't understand, did you want to set a goal, yes or no?");
                    convo.next();
                }
            }
        ]);
    });
});

