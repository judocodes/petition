const bcrypt = require('../utils/bcrypt');
const db = require('./db_init');

function addUser(first, last, email, password) {
    return bcrypt
        .hash(password)
        .then(hashedPw => {
            return db.query(
                `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES($1, $2, $3, $4) RETURNING id`,
                [first, last, email, hashedPw]
            );
        })
        .then(result => result.rows[0].id)
        .then(id => {
            return addProfileInfo(id);
        });
}
function addProfileInfo(userId, city, age, url) {
    if (url && !url.startsWith('http')) {
        url = 'http://' + url;
    }

    return db
        .query(
            `
        INSERT INTO user_profiles (user_id, city, age, url)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id)
            DO UPDATE SET city = $2, age = $3, url = $4
            RETURNING user_id AS id`,
            [userId, city || null, age || null, url || null]
        )
        .then(result => result.rows[0].id);
}
function addSignature(signature, userId) {
    return db
        .query(
            `
        INSERT INTO signatures (signature, user_id)
        VALUES ($1, $2) RETURNING user_id
    `,
            [signature, userId]
        )
        .then(result => result.rows[0].user_id);
}

module.exports = {
    addUser,
    addProfileInfo,
    addSignature,
};
