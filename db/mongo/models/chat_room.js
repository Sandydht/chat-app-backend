const mongoose = require('mongoose');
const chatRoomSchema = require('~/db/mongo/schemas/chatRoomSchema');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

chatRoomSchema.plugin(mongoosePaginate);
chatRoomSchema.plugin(mongooseAggregatePaginate);

const chatRoom = mongoose.model('chat_room', chatRoomSchema);

module.exports = chatRoom;
