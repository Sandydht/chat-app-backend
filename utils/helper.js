const bcrypt = require('bcrypt');

const helper = {};

helper.payloadJwt = (user) => ({
    _id: user._id,
    username: user.username,
    phone_number: user.phone_number
});

helper.comparePasswordAsync = (param1, param2) => {
    param1 = param1 || "";
    param2 = param2 || "";
    return new Promise((resolve, reject) => {
        bcrypt.compare(param1, param2, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

helper.passportHandler = {
    session: false,
    failureRedirect: '/response/fail'
};

module.exports = helper;
