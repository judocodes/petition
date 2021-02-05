function addCsrfToken(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
}

function denyXFrames(req, res, next) {
    res.set('x-frame-options', 'DENY');
    next();
}

module.exports = {
    addCsrfToken,
    denyXFrames,
};
