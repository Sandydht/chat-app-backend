const app = require('express').Router();
const errorHandler = require('~/utils/errorHandler');
const helper = require('~/utils/helper');
const passport = require('passport');
const dataMeta = require('~/utils/dataMeta');
const ChatMessage = require('~/db/mongo/models/chat_message');

app.get('/list-paginate/:chat_room_id', passport.authenticate('jwt', helper.passportHandler), async (req, res) => {
    try {
        const meta = {
            ...dataMeta(req),
            message: req.query.message == undefined ? '' : helper.replaceSqlInjection(req.query.message)
        };

        let query = {
            deleted_at: null,
            chat_room_id: req.params.chat_room_id
        };

        if (meta.message) {
            const message = new RegExp(meta.message, 'i');
            query.message = { $regex: message };
        }

        const chatMessage = await ChatMessage.find(query);

        res.json({ status: 'success', result: chatMessage });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

module.exports = app;
