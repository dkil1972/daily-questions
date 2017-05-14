'use strict'

require('datejs');

const slackBot = (reminders) => {
    return {
        start: (controller) => {
            let bot = controller.spawn({
                debug: false,
                token:process.env.TOKEN
            }).startRTM();

            //TODO every minute check the db for any users who want a reminder
            setInterval(() => {
                let now = new Date(Date.now());
                let oneMinuteAgo = new Date(now).add({minutes : -1});
                reminders.get({'payload.time' : { $gte : oneMinuteAgo, $lte : now }}, (docs) => {
                    docs.forEach(function(element) {
                        let message = {
                            text:'hi there',
                            user: element.payload.userId
                        }
                        bot.startPrivateConversation(message, (err, conversation) => {
                            if(err) { console.log(err); }
                            conversation.say('hi, it\'s time to rate yourself (1...10) on how well you did today...');
                            conversation.ask('did you do your best to ' + element.payload.goal + '?', (response, convo) => {
                                let rating = parseInt(response.text);
                                if(isNaN(rating)){
                                    convo.say('give me a number between 1 and 10...');
                                    convo.repeat();
                                    convo.next();
                                } else {
                                    convo.say('thanks, speak tomorrow');
                                    reminders.insert({userId : convo.context.user, channel : convo.context.channel, rating : rating }, 'daily-question-rating');
                                    convo.next();
                                }
                            });
                            conversation.next();
                        }, {}, 'default');
                    });
                });
            }, 20000);
        }
    }
}

module.exports = slackBot;
