'use strict'

const slackBot = (reminders) => {
    return {
        start: (controller) => {
            let bot = controller.spawn({
                debug: false,
                token:process.env.TOKEN
            });

            //TODO every minute check the db for any users who want a reminder
            reminders.get(Date.now(), (docs) => {
                docs.forEach(function(element) {
//                    let goalSetupConversation = require('./goalSetupConversation');
//                    goalSetupConversation.init(bot.botkit);
                });
            });
        }
    }
}

module.exports = slackBot;
