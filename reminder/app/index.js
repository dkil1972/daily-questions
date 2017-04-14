let Botkit = require('botkit');
let consoleBot = require('./consoleBot');
let postMan = require('./PostMan')

consoleBot.start(Botkit.consolebot());
