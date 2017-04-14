var ConsoleBot = function () {};

ConsoleBot.prototype.init = function(controller) {
    controller.spawn();

    controller.hears('hello', 'message_received', function(bot, message) {
        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, 'Hello ' + user.name + '!!');
            } else {
                bot.reply(message, 'Hello from consoleBot in reminder');
            }
        });
    });
}

module.exports = ConsoleBot;
