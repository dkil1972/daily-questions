const consoleBot = () => {
    return {
        start : (controller) => {
            let bot = controller.spawn({debug: false});
            //every minute check the db for any users who want a reminder
            //let reminders = db.CheckForReminders()
            //reminders.forEach(function(element) {

            controller.startConversation(bot, "hi there", function(err, convo) {
                convo.say("Did you do your best to leave work at 8pm?");
                convo.next();
            }, {}, 'default');
        }
    };
}

module.exports = consoleBot();
