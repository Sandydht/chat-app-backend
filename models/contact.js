const mongoose = require('mongoose');
const contactSchema = require('~/schemas/contactSchema');

const contact = mongoose.model('contact', contactSchema);

module.exports = contact;
