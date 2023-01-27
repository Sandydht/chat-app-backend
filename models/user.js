const mongoose = require('mongoose');
const userSchema = require('~/schemas/userSchema');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);

const user = mongoose.model('user', userSchema);

module.exports = user;
