const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    chat_room_id: { type: Schema.ObjectId, ref: 'chat_room' },
    user_id: { type: Schema.ObjectId, ref: 'user' },
    user_recipient_id: { type: Schema.ObjectId, ref: 'user' },
    message: { type: String },

    deleted_at: { type: Date }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = userSchema;
