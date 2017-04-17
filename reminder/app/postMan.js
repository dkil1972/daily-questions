let amqp = require('amqplib/callback_api');
let util = require('util');
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

var url = 'mongodb://172.17.0.5:27017/daily-questions-reminder';
const db = () => {
    return {
        insert : (message) => {
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");

                db.collection('inserts').insertOne(message, function(err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.insertedCount);
                    db.close();
                });
            });
        }
    }
}



const postMan = () => {
    amqp.connect('amqp://172.17.0.3', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'dqReminderTime';
            ch.assertQueue(q, {durable:false});
            ch.consume(q, (msg) => {
                //TODO (remember at most once message processing)dd
                console.log('processing message...');
                db().insert(JSON.parse(msg.content));
            }, {noAck:true});

        });
    });
}

module.exports = postMan();
