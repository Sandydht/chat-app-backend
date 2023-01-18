const joi = require('joi');

const joiValidate = {
    register: joi.object({
        username: joi.string().trim().required(),
        phone_number: joi.string().trim().required(),
        password: joi.string().trim().required()
    }),
    login: joi.object({
        phone_number: joi.string().trim().required(),
        password: joi.string().trim().required()
    })
};

module.exports = joiValidate;
