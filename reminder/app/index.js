let Botkit = require('botkit');
let postMan = require('./PostMan')
let reminders = require('./reminders');
let consoleBot = require('./consoleBot')(reminders);
let slackBot = require('./slackBot')(reminders);

slackBot.start(Botkit.slackbot());
consoleBot.start(Botkit.consolebot());
