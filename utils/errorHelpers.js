
function createError(errorMessage, statusCode = 500) {
    const err = new Error(errorMessage);
    err.status = statusCode;
    return err;
};

module.exports = {
    createError,
};