const express = require('express');
const router = new express.Router();
const { addSignature } = require('../database/db');
const { requireNoSignature } = require('../utils/auth');

router.use('/petition', requireNoSignature);

router.get('/petition', (req, res) => {
    res.render('petition');
});

router.post('/petition', (req, res) => {
    const { userId } = req.session;
    const { signature } = req.body;

    addSignature(signature, userId)
        .then(() => {
            req.session.signed = true;
            res.redirect('/thanks');
        })
        .catch(e => {
            res.render('petition', {
                error: 'Please provide a valid signature.',
            });
        });
});

module.exports = router;
