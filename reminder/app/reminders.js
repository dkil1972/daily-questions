'use strict'
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

const reminders = () => {
    const url = 'mongodb://172.17.0.5:27017/daily-questions-reminder';
    return {
        insert : (message) => {
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");

                db.collection('inserts').insertOne(message, function(err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.insertedCount);
                    db.close();
                });
            });
        },
        get : (time, cb) => {
            console.log('getting reminders at - ' + time);
            MongoClient.connect(url, function(err, db) {
                console.log(err);
                assert.equal(null, err);
                console.log("Connected correctly to server");
                return db.collection('inserts').find({}).toArray((err, docs) => {
                    assert.equal(null, err);
                    db.close();
                    cb(docs);
                });
            });
        }
    }
}

module.exports = reminders();
