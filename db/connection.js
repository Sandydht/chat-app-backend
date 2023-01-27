/* eslint-disable no-console */
const mongoose = require('mongoose');

const NODE_ENV = process.env.NODE_ENV || 'development';

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'chatapp';
const MONGO_PORT = process.env.MONGO_PORT || '27017';

const MONGO_ATLAS_USER = process.env.MONGO_ATLAS_USER || 'zzz';
const MONGO_ATLAS_PASS = process.env.MONGO_ATLAS_PASS || 'zzz';
const MONGO_ATLAS_HOST = process.env.MONGO_ATLAS_HOST || 'zzz';

let connection = null;

if (NODE_ENV === 'development') {
    connection = `mongodb://${MONGO_ATLAS_USER}:${MONGO_ATLAS_PASS}@${MONGO_ATLAS_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?replicaSet=atlas-4frcr0-shard-0&ssl=true&authSource=admin`;
} else {
    connection = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;
}

mongoose.set('strictQuery', false);
mongoose.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB is ready.', new Date());
});

module.exports = db;
