const app = require('express').Router();
const errorHandler = require('~/utils/errorHandler');
const helper = require('~/utils/helper');
const passport = require('passport');

app.get('/', passport.authenticate('jwt', helper.passportHandler), (req, res) => {
    try {
        res.json({ status: 'success', result: 'data' });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

module.exports = app;
