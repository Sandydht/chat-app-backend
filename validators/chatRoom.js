const joi = require('joi');

const joiValidate = {
    create: joi.object({
        user_id: joi.string().trim().required(),
        user_recipient_id: joi.string().trim().required()
    })
};

module.exports = joiValidate;
