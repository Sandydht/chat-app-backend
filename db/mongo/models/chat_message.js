const mongoose = require('mongoose');
const chatMessageSchema = require('~/db/mongo/schemas/chatMessageSchema');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

chatMessageSchema.plugin(mongoosePaginate);
chatMessageSchema.plugin(mongooseAggregatePaginate);

const chatMessage = mongoose.model('chat_message', chatMessageSchema);

module.exports = chatMessage;
