'use strict';

let Botkit = require('botkit');
let consoleBot = require('./ConsoleBot')();
let slackBot = require('./slackBot')();
let exchange = require('./exchange')();

let slackController = Botkit.slackbot();
let consoleController = Botkit.consolebot();

slackBot.init(slackController, exchange);
consoleBot.init(consoleController);
