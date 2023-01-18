const errorHandler = {};

// Status code 400
errorHandler.badRequest = (res, err) => {
    return res.status(400).json({ status: 'error', message: err });
};
errorHandler.unauthorized = (res, err) => {
    return res.status(401).json({ status: 'error', message: err });
};
errorHandler.forbidden = (res, err) => {
    return res.status(403).json({ status: 'error', message: err });
};
errorHandler.notFound = (res, err) => {
    return res.status(404).json({ status: 'error', message: err });
};

module.exports = errorHandler;
