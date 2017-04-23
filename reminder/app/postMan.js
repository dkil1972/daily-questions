let amqp = require('amqplib/callback_api');
let util = require('util');

const postMan = () => {
    amqp.connect('amqp://172.17.0.3', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'dqReminderTime';
            ch.assertQueue(q, {durable:false});
            ch.consume(q, (msg) => {
                //TODO (remember at most once message processing)dd
                //TODO what happens if the db is down?
                console.log('processing message...');
                reminders().insert(JSON.parse(msg.content));
            }, {noAck:true});

        });
    });
}

module.exports = postMan();
