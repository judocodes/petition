const express = require('express');
const router = new express.Router();
const { getAllSigners, getAllSignersByCity } = require('../database/db');

router.get('/signers', (req, res) => {
    getAllSigners()
        .then(signers => {
            res.render('signers', {
                num: signers.length,
                signers,
            });
        })
        .catch(() => {
            res.render('signers', {
                error:
                    'An error occured. Get back to <a class="font-bold text-blue-600" href="/">Home</a>.',
            });
        });
});

router.get('/signers/:city', (req, res) => {
    const { city } = req.params;

    getAllSignersByCity(city).then(signers => {
        res.render('signers', {
            num: signers.length,
            signers,
        });
    });
});

module.exports = router;
