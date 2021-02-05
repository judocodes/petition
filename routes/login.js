const express = require('express');
const router = new express.Router();
const { getUserByEmail, hasUserSigned } = require('../database/db');
const { compare } = require('../utils/bcrypt');
const { requireLoggedOut } = require('../utils/auth');

router.use('/login', requireLoggedOut);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    getUserByEmail(email)
        .then(user => {
            if (!user) {
                throw new Error('User information incorrect');
            }

            return compare(password, user.password).then(isValid => {
                if (isValid) {
                    req.session.userId = user.id;

                    return hasUserSigned(user.id).then(hasSigned => {
                        if (!hasSigned) {
                            res.redirect('/petition');
                        } else {
                            req.session.signed = true;
                            res.redirect('/thanks');
                        }
                    });
                } else {
                    throw new Error('User information incorrect.');
                }
            });
        })
        .catch(error => {
            res.render('login', { error: error.message });
        });
});

module.exports = router;
