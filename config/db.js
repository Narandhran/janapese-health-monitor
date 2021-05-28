const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const config = require('./index').db[process.env.NODE_ENV]
// establish connection to mongodb
var database = {
    connectivity: () => {
        mongoose.set('debug', true);
        mongoose.Promise = global.Promise;
        let connectionString = config.username == ''
            ? `mongodb://${config.host}:${config.port}/${config.db}`
            : `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.db}`;
        mongoose.connect(connectionString, { useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true });
        const db = mongoose.connection;
        return db;
    }
};

module.exports = database;