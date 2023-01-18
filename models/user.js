const mongoose = require('mongoose');
const userSchema = require('~/schemas/userSchema');

const user = mongoose.model('user', userSchema);

module.exports = user;
