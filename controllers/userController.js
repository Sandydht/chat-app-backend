const app = require('express').Router();
const helper = require('~/utils/helper');
const passport = require('passport');
const errorHandler = require('~/utils/errorHandler');
const dataMeta = require('~/utils/dataMeta');
const User = require('~/db/mongo/models/user');
const mongoose = require('mongoose');

app.get('/list-paginate', passport.authenticate('jwt', helper.passportHandler), async (req, res) => {
    try {
        const meta = {
            ...dataMeta(req),
            name: req.query.name == undefined ? '' : helper.replaceSqlInjection(req.query.name)
        };

        const query = [
            { deleted_at: null },
            { _id: { $ne: mongoose.Types.ObjectId(req.user._id) } }
        ];

        if (meta.name) {
            const name = new RegExp(meta.name, 'i');
            query.push({ username: { $regex: name } });
        }

        const myAggregate = User.aggregate([
            { $match: { $and: query } },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    phone_number: { $first: '$phone_number' },
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

        const result = await User.aggregatePaginate(myAggregate, options);
        result.meta = meta;

        res.json({ status: 'success', result });
    } catch (error) {
        errorHandler.badRequest(res, error);
    }
});

module.exports = app;
