let amqp = require('amqplib/callback_api');
let util = require('util');

const postMan = (reminders) => {
    let rabbitIp = process.env.RABBIT_IP
    amqp.connect('amqp://'+ rabbitIp, (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'dqReminderTime';
            ch.assertQueue(q, {durable:false});
            ch.consume(q, (msg) => {
                //TODO (remember at most once message processing)dd
                //TODO what happens if the db is down?
                console.log('processing message...');
                reminders.insert(JSON.parse(msg.content, 'daily-questions'));
            }, {noAck:true});

        });
    });
}

module.exports = postMan;
