'use strict'
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

const reminders = () => {
    let mongoIp = process.env.MONGO_IP
    const url = 'mongodb://'+ mongoIp + ':27017/daily-questions-reminder';
    return {
        insert : (message, collection) => {
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");

                db.collection(collection).insertOne(message, function(err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.insertedCount);
                    db.close();
                });
            });
        },
        get : (query, cb) => {
            console.log(query);

            MongoClient.connect(url, function(err, db) {
                console.log(err);
                assert.equal(null, err);
                console.log("Connected correctly to server");
                return db.collection('daily-questions').find(query).toArray((err, docs) => {
                    assert.equal(null, err);
                    db.close();
                    cb(docs);
                });
            });
        }
    }
}

module.exports = reminders();
