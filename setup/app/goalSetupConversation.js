'use strick'

const goalSetupConversation = () => {
    return {
        init : (bot, message) => {
            bot.startConversation(message, (err, convo) => {
                convo.say('testing things out');
                convo.next();
            });
        },
    }
}

module.exports = goalSetupConversation();
