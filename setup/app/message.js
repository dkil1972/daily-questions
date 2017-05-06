'use strict'

const message = () => {
    return {
        createFrom : (app, messageType, response, goal, questionTime) => {
            return {
                headers : [app, messageType],
                payload : {
                    userId : response.user,
                    channel : response.channel,
                    text : response.text,
                    time : questionTime,
                    goal : goal
                }
            };
        }
    }
}

module.exports = message();
