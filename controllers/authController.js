const { register, login } = require('~/validators/user');
const app = require('express').Router();
const errorHandler = require('~/utils/errorHandler');
const User = require('~/db/mongo/models/user');
const formatter = require('~/utils/formatter');
const helper = require('~/utils/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = process.env.SECRET;
const userTransform = require('~/transformers/user');
const passport = require('passport');
const helper = require('~/utils/helper');

app.post('/register', async (req, res) => {
    try {
        const validate = register.validate(req.body);
        if (validate.error) throw validate.error;

        const phoneNumber = formatter.getPhoneNumber(req.body.phone_number);
        const user = await User.findOne({ phone_number: phoneNumber, deleted_at: null });
        if (user) return errorHandler.badRequest(res, 'User already exist');

        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) throw err;
                const newUser = new User({
                    username: req.body.username,
                    phone_number: phoneNumber,
                    password: hash
                });
                await newUser.save();
                const user = await User.findOne({ phone_number: phoneNumber, deleted_at: null });
                const result = userTransform.showUser(user);
                const payload = helper.payloadJwt(user);
                jwt.sign(payload, secret, { expiresIn: 3600 * 24 * 30 }, (err, token) => {
                    if (err) throw 'Error signing token';
                    res.json({ status: 'success', token: `Bearer ${token}`, result });
                });
            });
        });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const validate = login.validate(req.body);
        if (validate.error) throw validate.error;

        const phoneNumber = formatter.getPhoneNumber(req.body.phone_number);
        const user = await User.findOne({ phone_number: phoneNumber, deleted_at: null });
        if (!user) return errorHandler.badRequest(res, 'Invalid phone number or password');

        const isMatch = await helper.comparePasswordAsync(req.body.password, user.password);
        if (!isMatch) return errorHandler.badRequest(res, 'Password is incorrect');

        const payload = helper.payloadJwt(user);
        jwt.sign(payload, secret, { expiresIn: 3600 * 24 * 30 }, async (err, token) => {
            if (err) throw 'Error signing token';
            const result = userTransform.showUser(user);
            res.json({ status: 'success', token: `Bearer ${token}`, result });
        });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

app.post('/logout', passport.authenticate('jwt', helper.passportHandler), async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id, deleted_at: null });
        if (!user) return errorHandler.badRequest(res, 'User not found');
        req.logout();
        res.json({ status: 'OK', result: 'success' });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

module.exports = app;
