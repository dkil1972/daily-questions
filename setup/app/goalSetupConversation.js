'use strick'

require ('datejs');

const goalSetupConversation = () => {
    let timeSetup = (questionText, utterances, exchange) => {
        //TODO have a goal setup conversation and a time setup conversation and jump between the two
        return (response, conversation) => {
            let goal = response.text;
            conversation.addQuestion(questionText, (resp, con) => {
                let questionTime = Date.parse(resp.text);
                if(questionTime === null) {
                    con.addMessage('I\'m sorry, I didn\'t understand ' + resp.text);
                    timeSetup('try again', utterances, exchange)(resp, con);
                } else {
                    con.addMessage('You want me to ask you every day at ' + questionTime.toLocaleTimeString());
                    con.addQuestion('Is that correct?', [
                        {
                            pattern: utterances.yes,
                            callback: (r, c) => {
                                c.addMessage('Great, let\'s see if it\'s all setup...');
                                c.addMessage('I\'ll ask you...');
                                c.addMessage('Did you do your best to ' + goal + '?');
                                c.addMessage('Everyday at ' + questionTime.toLocaleTimeString() + '...')
                                c.addQuestion('Does the daily question look correct to you (yes or no)?', [
                                    {
                                        pattern: utterances.yes,
                                        callback: (r, c) => {
                                            c.addMessage('Great, all setup. catch ya later.');
                                            let message = require('./message');
                                            exchange.publish(
                                                message.createFrom('slack', 'DailyQuestionSetup', response, goal, questionTime));
                                            c.next();
                                        }
                                    },
                                    {
                                        pattern: utterances.no,
                                        callback: (r, c) => {
                                            c.addMessage('Let\'s try again...');
                                            c.next();
                                        }
                                    }
                                ], {}, 'goal-setup');
                                c.next();
                            }
                        },
                        {
                            pattern: utterances.no,
                            callback: timeSetup('try again', utterances, exchange)
                        }
                    ], {}, 'goal-setup');
                    con.next();
                }
            }, {}, 'goal-setup');
            conversation.next();
        }
    }

    return {
        init : (bot, message, exchange) => {
            bot.createConversation(message, (err, convo) => {
                convo.addQuestion('what is the goal?',
                    timeSetup('sounds good, what time each day would you like me to ask how well you did?', bot.utterances, exchange), {}, 'goal-setup');

                convo.addMessage({ text:'bad' }, 'what-now');
                convo.addMessage({
                    text:'Sorry, I did not understand',
                    action: 'default'
                }, 'unexpected');

                convo.ask('Hey, would you like to setup a goal?', [
                    {
                        pattern: bot.utterances.yes,
                        callback: (response, con) => {
                            con.gotoThread('goal-setup');
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
