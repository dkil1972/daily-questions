'use strick'

require ('datejs');

const goalSetupConversation = () => {
    let confirmCorrectSetup = (conversation, questionTime, bot, goal) => {
        conversation.say('Great, let\'s see if it\'s all setup...');
        conversation.say('I\'ll ask you...');
        conversation.say('Did you do your best to ' + goal + '?');
        conversation.say('Everyday at ' + questionTime.toLocaleTimeString() + '...')
        conversation.ask('Does the daily question look correct to you (yes or no)?', [
            {
                pattern: bot.utterances.yes,
                callback: (r, c) => {
                    c.say('Great, all setup. catch ya later.');
                    c.next();
                }
            },
            {
                pattern: bot.utterances.no,
                callback: (r, c) => {
                    c.say('Let\'s try again...');
                    c.next();
                }
            }
        ]);
        conversation.next();
    }

    return {
        init : (bot, message, exchange) => {
            bot.createConversation(message, (err, convo) => {
                let goal = '';
                let questionTime;
                convo.addQuestion('what is the goal?', (response, conversation) => {
                    goal = response.text;
                    conversation.gotoThread('time-setup');
                }, {}, 'question-setup');

                convo.addQuestion('What time each day would you like me to ask how well you did?', (response, conversation) => {
                    questionTime = Date.parse(response.text);
                    if(questionTime === null) {
                        conversation.say('I\'m sorry, I didn\'t understand ' + response.text);
                        conversation.repeat();
                    } else {
                        convo.say('You want me to ask you every day at ' + questionTime.toLocaleTimeString());
                        convo.ask('Is that correct?', [
                            {
                                pattern: bot.utterances.yes,
                                callback: (r, c) => {
                                    confirmCorrectSetup(c, questionTime, bot, goal);
                                    let message = require('./message');
                                    exchange.publish(
                                        message.createFrom('slack', 'DailyQuestionSetup', r, goal, questionTime));
                                }
                            }
                        ]);
                    }
                    conversation.next();
                }, {}, 'time-setup');

                convo.addMessage({ text:'bad' }, 'what-now');
                convo.addMessage({
                    text:'Sorry, I did not understand',
                    action: 'default'
                }, 'unexpected');

                convo.ask('Hey, would you like to setup a goal?', [
                    {
                        pattern: bot.utterances.yes,
                        callback: (response, con) => {
                            con.gotoThread('question-setup');
                        }
                    },
                    {
                        pattern: bot.utterances.no,
                        callback: (response, con) => {
                            con.gotoThread('what-now');
                        }
                    },
                    {
                        pattern: 'true',
                        callback: (response, con) => {
                            con.gotoThread('unexpected');
                        }
                    },
                ]);
                convo.activate();
            });
        },
    }
}

module.exports = goalSetupConversation();
