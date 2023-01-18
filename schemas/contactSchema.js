const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    user_contact_id: { type: Schema.ObjectId, ref: 'user' },
    user_id: { type: Schema.ObjectId, ref: 'user' },

    deleted_at: { type: Date }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = contactSchema;
