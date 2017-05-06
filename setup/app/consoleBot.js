'use strict';

const consoleBot = () => {
    return {
        init : (controller) => {
            let bot = controller.spawn();

            controller.hears('hello', 'message_received', function(bot, message) {
                let goalSetupConversation = require('./goalSetupConversation');
                goalSetupConversation.init(bot, message);
            });

    }
}
   
}
module.exports = consoleBot;
