const db = require('./db_init');

function getUserNameById(id) {
    return db
        .query(
            `
        SELECT first_name AS name FROM users
        WHERE id = $1`,
            [id]
        )
        .then(result => result.rows[0].name);
}
function getFullProfileById(userId) {
    return db
        .query(
            `
        SELECT 
        users.first_name AS first, 
        users.last_name AS last, 
        users.email AS email,
        users.password AS password,
        user_profiles.age AS age, 
        user_profiles.city AS city, 
        user_profiles.url AS url
        FROM users
        INNER JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE users.id = $1`,
            [userId]
        )
        .then(result => result.rows[0]);
}
function getUserByEmail(email) {
    return db
        .query(
            `
        SELECT * FROM users
        WHERE email = $1`,
            [email]
        )
        .then(result => result.rows[0]);
}

module.exports = {
    getUserNameById,
    getFullProfileById,
    getUserByEmail,
};
