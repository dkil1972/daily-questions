let Botkit = require('botkit');
let reminders = require('./reminders');
let postMan = require('./postMan')(reminders);
let consoleBot = require('./consoleBot')(reminders);
let slackBot = require('./slackBot')(reminders);

slackBot.start(Botkit.slackbot());
consoleBot.start(Botkit.consolebot());
