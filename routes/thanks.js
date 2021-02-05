const express = require('express');
const router = new express.Router();
const { getUserNameById, getSignatureByUserId } = require('../database/db');

router.get(
    '/thanks',
    (req, res) => {
        const { userId } = req.session;

        getUserNameById(userId).then(name => {
            getSignatureByUserId(userId)
                .then(signature => {
                    res.render('thanks', {
                        name,
                        signature,
                    });
                })
                .catch(() => {
                    res.redirect('/register');
                });
        });
    },
    (error, req, res, next) => {
        res.redirect('/petition');
    }
);

router.post('/thanks/logout', (req, res) => {
    req.session = null;
    res.redirect('/login');
});

module.exports = router;
