let Botkit = require('botkit');
let consoleBot = require('./ConsoleBot');
let slackBot = require('./SlackBot');

console.log("****** " + slackBot);
console.log("****** " + consoleBot);

let consoleController = Botkit.consolebot();
let slackController = Botkit.slackbot();

consoleBot.prototype.init(consoleController);
slackBot.prototype.init(slackController);

