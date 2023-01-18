const formatter = require('~/utils/formatter');

const transformer = {};
transformer.showUser = (user) => userDetail(user);

const userDetail = (data) => ({
    _id: data._id || null,
    username: data.username || null,
    phone_number: data.phone_number ? formatter.getPhoneNumber(data.phone_number) : null
});

module.exports = transformer;
