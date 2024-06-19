
function createCustomError(errorMessage, statusCode = 500) {
    const error = new Error(errorMessage);
    error.status = statusCode;
    return error;
};

module.exports = {
    createCustomError,
};