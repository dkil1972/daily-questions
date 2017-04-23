//TODO set the context if it's first time user has said hello then explain the purpose of the daily questions
//TODO /configure will allow someone to set times etc for asking the daily questions
//TODO /questions will list all the daily questions
'use strict';

let MongoClient = require('mongodb').MongoClient;

let uri = 'mongodb://172.17.0.2:27017/daily-questions'

function insertDocuments(db, data, callback){
    let dqs = db.collection('daily-questions');
    dqs.insertOne({'response' : data}, function(err, db){
        callback();  
    });
}

function confirmSetupUsing(bot) {
    return [
        {
            pattern: bot.utterances.yes,
            callback: function(response, convo){
                convo.say("great, speak soon!");
                convo.next();
            },
        },
        {
            pattern: bot.utterances.no,
            callback: function(response, convo){
                convo.say("hmmmm, let me think about that");
                convo.next();
            }
        }
    ]
}

function chatAboutSetupUsing(bot, goal, exchange) {
    return [
        {
            default: true,
            callback: function(response, convo){
                require('datejs');
                let exact = Date.parse(response.text);
                if(exact===null) {
                    convo.say(
                        "sorry I don't understand the time you've entered - " + response.text);
                    convo.ask(
                        "What time, each day, would you like me to ask if you did your best to " + response.text + "?", 
                    chatAboutSetupUsing(bot, goal, exchange));
                    convo.next();
                }else{
                    convo.say("great stuff, all setup...");
                    convo.say("I'll ask you everyday at " + response.text + " did you do your best to " + goal + "?");
                    convo.ask("All good with you?", confirmSetupUsing(bot));
                }
                convo.next();
            }
        }
    ]
}

function respondToShortNameWith(bot, exchange) {
    return [
        {
            default: true,
            callback: function(response, convo){
                convo.say("almost done...");
                convo.ask(
                    "What time, each day, would you like me to ask if you did your best to " + response.text + "?", 
                    chatAboutSetupUsing(bot, response.text, exchange));
                convo.next();
            }
        }
    ]
}
function chatAboutTheGoalWith(bot, exchange) {
    return [
        {
            pattern: bot.utterances.yes,
            callback: function(response, convo){
                convo.say("ok, great!");
                convo.ask("What's the goal?",
                    currentRealityConversationAbout("goal", bot, exchange));
                convo.next();
            },
        },
        {
            pattern: bot.utterances.no,
            callback: function(response, convo){
                convo.say("ok, no worries...");
                convo.ask("What would you like the short name for your goal to be?", respondToShortNameWith(bot, exchange));
                convo.next();
            },
        },
        {
            pattern: "why",
            callback: function(response, convo){
                convo.say("the answers will help me to remind you of the importance of achieving the goal.");
                convo.next();
            },
        }
    ]
}

function currentRealityConversationAbout(topic, bot, exchange){
    return [
        {
            default: true,
            callback: function(response, convo){
                convo.say("sounds cool, before we setup the goal...");
                convo.ask("can I ask you a couple of questions?", chatAboutTheGoalWith(bot, exchange));
                convo.next();
            }
        }
    ];
}

const slackBot = () => {
    return {
        init : (controller, exchange) => {
            controller.spawn({
                token:process.env.TOKEN
            }).startRTM();



            controller.hears('hello',['direct_message', 'direct_mention', 'mention'], 
                (bot, message) => {
                    let goalSetupConversation = require('./goalSetupConversation');
                    let conversation = goalSetupConversation.init(bot, message);
                    conversation.activate();
                  


//                function(bot, message) {
//                    bot.startConversation(message, function(err, convo) {
//                        //TODO Have we spoken to this user before?
//                        let message = require('./message');
//                        exchange.publish(
//                            message.createFrom('slack', 'DailyQuestionSetup', response, goal));
//                    });
//                });
                });
        }
    }
}

module.exports = slackBot;
