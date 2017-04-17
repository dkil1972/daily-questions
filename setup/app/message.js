'use strict'

const message = () => {
    return {
        createFrom : (app, messageType, response, goal) => {
            return {
                headers : [app, messageType],
                payload : {
                    userId : response.user,
                    channel : response.channel,
                    text : response.text,
                    goal : goal
                }
            };
        }
    }
}

module.exports = message();
