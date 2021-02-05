const express = require('express');
const router = new express.Router();
const validator = require('validator');
const {
    getFullProfileById,
    addProfileInfo,
    updateUserProfile,
    deleteUser,
    deleteSignature,
} = require('../database/db');

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.get(
    '/profile/edit',
    (req, res) => {
        const { userId } = req.session;

        getFullProfileById(userId).then(user => {
            if (user.url) {
                user.url = user.url.replace(/http:\/\//, '');
            }

            res.render('edit', {
                ...user,
            });
        });
    },
    (error, req, res, next) => {
        res.render('edit', {
            error: error.message,
        });
    }
);

router.post(
    '/profile',
    (req, res) => {
        const { userId } = req.session;

        let { city, age, url } = req.body;

        addProfileInfo(userId, city, age, url)
            .then(() => {
                res.redirect('/petition');
            })
            .catch(error => {
                throw new Error(error.message);
            });
    },
    (error, req, res, next) => {
        res.render('profile', {
            error: error.message,
        });
    }
);

router.post(
    '/profile/edit',
    (req, res) => {
        const { userId } = req.session;

        const updatedUser = req.body;

        if (!updatedUser.first || !updatedUser.last || !updatedUser.email) {
            throw new Error(
                'Provide essential fields: First Name, Last Name, and E-Mail.'
            );
        }

        if (!validator.isEmail(updatedUser.email)) {
            throw new Error('Provide a valid E-Mail.');
        }

        if (updatedUser.password !== updatedUser.match) {
            throw new Error('Passwords must match.');
        }

        if (!updatedUser.password) {
            throw new Error('Please provide a password.');
        }

        if (updatedUser.password === 'password') {
            updatedUser.password = null;
        }

        updateUserProfile(userId, updatedUser)
            .then(user => {
                if (user.url) {
                    user.url = user.url.replace(/http:\/\//, '');
                }

                res.render('edit', {
                    ...user,
                    success: 'Update successful.',
                });
            })
            .catch(error =>
                getFullProfileById(userId).then(user => {
                    res.render('edit', {
                        ...user,
                        error: 'E-Mail is already taken.',
                    });
                })
            );
    },
    (error, req, res, next) => {
        res.render('edit', {
            error: error.message,
        });
    }
);

router.post('/profile/deleteProfile', (req, res) => {
    const { userId } = req.session;

    deleteUser(userId)
        .then(() => {
            req.session.userId = '';
            req.session.signed = false;
            res.redirect('/');
        })
        .catch(() => {
            res.render('edit', {
                error: 'Couldn’t delete the user.',
            });
        });
});

router.post('/profile/deleteSignature', (req, res) => {
    const { userId } = req.session;

    deleteSignature(userId)
        .then(() => {
            req.session.signed = false;
            res.redirect('/petition');
        })
        .catch(() => {
            res.render('edit', {
                error: "Couldn't delete the signature.",
            });
        });
});

module.exports = router;
