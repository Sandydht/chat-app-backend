const app = require('express').Router();
const errorHandler = require('~/utils/errorHandler');

app.get('/fail', (_, res) => {
    errorHandler.unauthorized(res);
});

module.exports = app;
