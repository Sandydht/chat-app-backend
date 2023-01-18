const formatter = {};

formatter.getPhoneNumber = (phone) => {
    if (!phone) {
        return null;
    }

    // default indo
    const firstChar = phone.substring(0, 1);
    if (firstChar == '0') {
        return `+62${phone.substring(1, 100)}`;
    }
    if (firstChar == '6') {
        return `+${phone}`;
    }

    const findCountry = phone.substring(0, 3);
    if (findCountry == '+62') { // indonesia
        const findZero = phone.substring(3, 4);
        if (findZero == '0') {
            return `+62${phone.substring(4, 100)}`;
        }
        return phone;
    }
    return phone;
};

module.exports = formatter;
