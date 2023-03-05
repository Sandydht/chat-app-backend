const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String },
    phone_number: { type: String },
    password: { type: String },
    status: { type: String, default: 'available' },

    deleted_at: { type: Date }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = userSchema;
