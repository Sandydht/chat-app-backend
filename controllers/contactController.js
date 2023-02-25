const app = require('express').Router();
const errorHandler = require('~/utils/errorHandler');
const helper = require('~/utils/helper');
const passport = require('passport');
const dataMeta = require('~/utils/dataMeta');
const Contact = require('~/db/mongo/models/contact');
const mongoose = require('mongoose');

app.get('/list-paginate', passport.authenticate('jwt', helper.passportHandler), async (req, res) => {
    try {
        const meta = {
            ...dataMeta(req),
            name: req.query.name == undefined ? '' : helper.replaceSqlInjection(req.query.name)
        };

        const query = [
            { user_id: mongoose.Types.ObjectId(req.user._id) },
            { deleted_at: null }
        ];

        if (meta.name) {
            const name = new RegExp(meta.name, 'i');
            query.push({ 'user.username': { $regex: name } });
        }

        const myAggregate = Contact.aggregate([
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
            { $match: { $and: query } },
            {
                $group: {
                    _id: '$_id',
                    user_id: { $first: '$user._id' },
                    username: { $first: '$user.username' },
                    phone_number: { $first: '$user.phone_number' },
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

        const result = await Contact.aggregatePaginate(myAggregate, options);
        result.meta = meta;

        res.json({ status: 'success', result });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

module.exports = app;
