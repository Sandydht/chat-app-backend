const mongoose = require('mongoose');
const contactSchema = require('~/db/mongo/schemas/contactSchema');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

contactSchema.plugin(mongoosePaginate);
contactSchema.plugin(mongooseAggregatePaginate);

const contact = mongoose.model('contact', contactSchema);

module.exports = contact;
