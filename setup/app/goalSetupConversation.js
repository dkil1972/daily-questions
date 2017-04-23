'use strick'

const goalSetupConversation = () => {
    return {
        init : (bot, message) => {
            let conversation;
            bot.createConversation(message, (err, convo) => {
                convo.addMessage('testing things out');
                conversation = convo;
            });
            return conversation;
        },
    }
}

module.exports = goalSetupConversation();
