function requireLoggedIn(req, res, next) {
    const { userId } = req.session;

    if (!userId) {
        res.redirect(302, '/register');
    } else {
        next();
    }
}

function requireLoggedOut(req, res, next) {
    const { userId } = req.session;

    if (userId) {
        res.redirect('/petition');
    } else {
        next();
    }
}

function requireSignature(req, res, next) {
    const { signed } = req.session;

    if (!signed) {
        res.redirect(302, '/petition');
    } else {
        next();
    }
}

function requireNoSignature(req, res, next) {
    const { signed } = req.session;

    if (signed) {
        res.redirect('/thanks');
    } else {
        next();
    }
}

function removeSignatureWhenLoggedOut(req, res, next) {
    if (req.session.signed && !req.session.userId) {
        req.session.signed = false;
    }

    next();
}

// Sets locals accordingly, important for Nav in main.handlebars
function updateLoggedInStatus(req, res, next) {
    res.locals.loggedIn = Boolean(req.session.userId);
    next();
}

module.exports = {
    requireSignature,
    requireNoSignature,
    requireLoggedIn,
    requireLoggedOut,
    removeSignatureWhenLoggedOut,
    updateLoggedInStatus,
};
