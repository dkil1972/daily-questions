//TODO set the context if it's first time user has said hello then explain the purpose of the daily questions
//TODO /configure will allow someone to set times etc for asking the daily questions
//TODO /questions will list all the daily questions
'use strict';

let MongoClient = require('mongodb').MongoClient;

let mongoIp = process.env.MONGO_IP
let uri = 'mongodb://mongodb/daily-questions'


function insertDocuments(db, data, callback){
    let dqs = db.collection('daily-questions');
    dqs.insertOne({'response' : data}, function(err, db){
        callback();
    });
}

const SlackBot = () => {
    return {
        init : (controller, exchange) => {
            controller.spawn({
                token:process.env.TOKEN
            }).startRTM();



            controller.hears('hello',['direct_message', 'direct_mention', 'mention'],
                (bot, message) => {
                    let goalSetupConversation = require('./goalSetupConversation');
                    goalSetupConversation.init(bot, message, exchange);
                });
        }
    }
}

module.exports = SlackBot;
