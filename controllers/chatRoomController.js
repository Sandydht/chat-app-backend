const app = require('express').Router();
const errorHandler = require('~/utils/errorHandler');
const helper = require('~/utils/helper');
const passport = require('passport');
const dataMeta = require('~/utils/dataMeta');
const ChatRoom = require('~/db/mongo/models/chat_room');
const ChatMessage = require('~/db/mongo/models/chat_message');
const mongoose = require('mongoose');
const { create } = require('~/validators/chatRoom');

app.get('/list-paginate', passport.authenticate('jwt', helper.passportHandler), async (req, res) => {
    try {
        const meta = {
            ...dataMeta(req),
            message: req.query.message == undefined ? '' : helper.replaceSqlInjection(req.query.message)
        };

        const query = [
            { deleted_at: null }
        ];

        if (meta.message) {
            const message = new RegExp(meta.message, 'i');
            query.push({ 'chat_message.message': { $regex: message } });
        }

        const myAggregate = ChatRoom.aggregate([
            {
                $match: {
                    $and: [
                        { deleted_at: null },
                        { user_id: mongoose.Types.ObjectId(req.user._id) }
                    ]
                }
            },
            {
                $lookup: {
                  from: 'users',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user'
                }
            },
            {
                $unwind: {
                  path: '$user',
                  preserveNullAndEmptyArrays: false // required
                }
            },
            {
                $lookup: {
                    from: 'chat_messages',
                    localField: '_id',
                    foreignField: 'chat_room_id',
                    as: 'chat_message'
                }
            },
            {
                $unwind: {
                  path: '$chat_message',
                  preserveNullAndEmptyArrays: true // not required
                }
            },
            { $match: { $and: query } },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$user.username' },
                    phone_number: { $first: '$user.phone_number' },
                    message: { $first: '$chat_message.message' },
                    created_at: { $first: '$created_at' }
                }
            }
        ]);

        const options = {
            lean: false,
            sort: { created_at: -1 },
            page: meta.page,
            limit: meta.limit
        };

        const result = await ChatRoom.aggregatePaginate(myAggregate, options);
        result.meta = meta;

        res.json({ status: 'success', result });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

app.post('/create', passport.authenticate('jwt', helper.passportHandler), async (req, res) => {
    try {
        const validate = create.validate(req.body);
        if (validate.error) throw validate.error;

        const chatRoom = await ChatRoom.findOne({ user_id: req.body.user_id, user_recipient_id: req.body.user_recipient_id, deleted_at: null });
        if (chatRoom) {
            res.json({ status: 'success', result: chatRoom });
        } else {
            const newChatRoom = new ChatRoom({ ...req.body });
            await newChatRoom.save();
            res.json({ status: 'success', result: newChatRoom });
        }
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

app.delete('/delete/:id', passport.authenticate('jwt', helper.passportHandler), async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findOne({ _id: req.params.id, deleted_at: null }).select('_id').lean();
        if (!chatRoom) return errorHandler.badRequest(res, 'Chat room is not found');

        await Promise.all([
            ChatRoom.updateMany({ _id: chatRoom._id }, { deleted_at: new Date() }),
            ChatMessage.updateMany({ chat_room_id: chatRoom._id }, { deleted_at: new Date() })
        ]);

        res.json({ status: 'success', result: 'success' });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

module.exports = app;
