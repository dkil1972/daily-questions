'use strict'

const consoleBot = (reminders) => {
    return {
        start : (controller) => {
            let bot = controller.spawn({debug: false});
            //every minute check the db for any users who want a reminder
            // reminders.get(Date.now(), (docs) => {
            //     docs.forEach(function(element) {
            //     });
            // });
        }
    };
}

module.exports = consoleBot;
