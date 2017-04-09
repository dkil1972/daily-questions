let Botkit = require('botkit');
let consoleBot = require('./ConsoleBot');
let slackBot = require('./SlackBot');

let slackController = Botkit.slackbot();
let consoleController = Botkit.consolebot();

slackBot.prototype.init(slackController);
consoleBot.prototype.init(consoleController);
