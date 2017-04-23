'use strick'

const goalSetupConversation = () => {
    return {
        init : (bot) => {
            bot.startConversation('hi there', (err, convo) => {
                convo.say('testing things out');
                convo.next();
            });
        },
    }
}

module.exports = goalSetupConversation();
