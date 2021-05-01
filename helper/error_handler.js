function errorHandler(err, req, res, nex) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: "The user is not authorized" });
    }
    if (err.name === 'VaildationError') {
        return res.status(401).json({ message: err });
    }
    return res.status(500).json(err);
}
module.exports = errorHandler;