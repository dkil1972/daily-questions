'use strict'

let amqp = require('amqplib/callback_api');

const exchange = () => {
    return {
        publish : (message) => {
            amqp.connect('amqp://172.17.0.3', function(err,conn){
                conn.createChannel(function (err, ch){
                    var q = 'dqReminderTime';

                    ch.assertQueue(q, {durable: false});
                    // Note: on Node 6 Buffer.from(msg) should be used
                    ch.sendToQueue(q, new Buffer(JSON.stringify(message)));
                });
                setTimeout(function() { conn.close();}, 500);
            });

        }
    };
}

module.exports = exchange;
