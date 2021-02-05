const express = require('express');
const router = new express.Router();
const validator = require('validator');
const { addUser } = require('../database/db');

const { requireLoggedOut } = require('../utils/auth');

router.use('/register', requireLoggedOut);

router.get('/register', (req, res) => {
    res.render('register');
});

router.post(
    '/register',
    (req, res) => {
        const { email, first, last, password, match } = req.body;

        if (!email || !first || !last || !password || !match) {
            throw new Error('All fields are required.');
        }

        if (!validator.isEmail(email)) {
            throw new Error('Invalid E-Mail address.');
        }

        if (password !== match) {
            throw new Error('Passwords must match.');
        }

        if (password === 'password') {
            throw new Error('"Password" is not a safe password.');
        }

        addUser(first, last, email, password)
            .then(id => {
                req.session.userId = id;
                res.redirect('/profile');
            })
            .catch(() => {
                res.render('register', {
                    error: 'E-Mail already taken.',
                });
            });
    },
    (error, req, res, next) => {
        res.render('register', {
            error: error.message,
        });
    }
);

module.exports = router;
