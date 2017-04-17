let amqp = require('amqplib/callback_api');
let util = require('util');

const postMan = () => {
    amqp.connect('amqp://172.17.0.3', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'dqReminderTime';
            ch.assertQueue(q, {durable:false});
            ch.consume(q, (msg) => {
                //store these messages in the database (remember at most once message processing)dd
                console.log('[++++] - ' + msg.content.toString());
            }, {noAck:true});

        });
    });
}

module.exports = postMan();
