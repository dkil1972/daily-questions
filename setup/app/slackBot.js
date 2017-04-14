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

function publishMessage(reminderTime, goal) {
    let amqp = require('amqplib/callback_api');

    amqp.connect('amqp://172.17.0.3', function(err,conn){
        console.log('[x] - ' + err);
        conn.createChannel(function (err, ch){
            var q = 'dqReminderTime';

            ch.assertQueue(q, {durable: false});
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.sendToQueue(q, new Buffer(reminderTime));
            console.log(" [x] Sent " + reminderTime);
        });
        setTimeout(function() { conn.close();}, 500);
    });
}

function chatAboutSetupUsing(bot, goal) {
    return [
        {
            default: true,
            callback: function(response, convo){
                convo.say("great stuff, all setup...");
                convo.say("I'll ask you everyday at " + response.text + " did you do your best to " + goal + "?");
                convo.ask("All good with you?", confirmSetupUsing(bot));
                publishMessage(response.text, goal);
                convo.next();
            }
        }
    ]
}

function respondToShortNameWith(bot) {
    return [
        {
            default: true,
            callback: function(response, convo){
                convo.say("almost done...");
                convo.ask("What time, each day, would you like me to ask if you did your best to " + response.text + "?", chatAboutSetupUsing(bot, response.text));
                convo.next();
            }
        }
    ]
}
function chatAboutTheGoalWith(bot) {
    console.log("in chatAboutTheGoalWith...");
    return [
        {
            pattern: bot.utterances.yes,
            callback: function(response, convo){
                convo.say("ok, great!");
                convo.ask("What's the goal?", currentRealityConversationAbout("goal", bot));
                convo.next();
            },
        },
        {
            pattern: bot.utterances.no,
            callback: function(response, convo){
                convo.say("ok, no worries...");
                convo.ask("What would you like the short name for your goal to be?", respondToShortNameWith(bot));
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

function currentRealityConversationAbout(topic, bot){
    console.log("in currentRealityConversationAbout...");
    return [
        {
            default: true,
            callback: function(response, convo){
                convo.say("sounds cool, before we setup the goal...");
                convo.ask("can I ask you a couple of questions?", chatAboutTheGoalWith(bot));
                convo.next();
            }
        }
    ];
}

var SlackBot = function () {};

SlackBot.prototype.init = function(controller){
    controller.spawn({
        token:process.env.TOKEN
    }).startRTM();

    controller.hears('hello',['direct_message', 'direct_mention', 'mention'], function(bot, message) {
        var util = require('util');
        bot.startConversation(message, function(err, convo) {
            //TODO Have we spoken to this user before?

            convo.ask('hello, would you like to set a goal?', [
                {
                    pattern: bot.utterances.yes,
                    callback: function(response, convo){
                        console.log(util.inspect(convo, 3));
                        publishMessage(response.text, 'testing');
                        convo.say("ok, great!");
                        convo.ask("What's the goal?", currentRealityConversationAbout("goal", bot));
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
}
module.exports = SlackBot;
