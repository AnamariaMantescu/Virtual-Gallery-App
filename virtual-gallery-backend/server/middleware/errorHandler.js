function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error('[Global Error Handler]', err);

    res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
