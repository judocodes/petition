const db = require('./db_init');

// Signature
function getSignatureByUserId(userId) {
    return db
        .query(
            `
        SELECT signature FROM signatures
        WHERE user_id = $1`,
            [userId]
        )
        .then(result => result.rows[0].signature);
}

function hasUserSigned(userId) {
    return db
        .query(
            `
        SELECT signature FROM signatures
        WHERE user_id = $1`,
            [userId]
        )
        .then(result => result.rows[0] && result.rows[0].signature);
}

module.exports = {
    getSignatureByUserId,
    hasUserSigned,
};
