const db = require('./db_init');

// Lists
function getAllSigners() {
    return db
        .query(
            `
    SELECT signatures.signature, users.first_name AS first, users.last_name AS last, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
    FROM signatures
    INNER JOIN users
    ON signatures.user_id = users.id
	INNER JOIN user_profiles
	ON users.id = user_profiles.user_id
    `
        )
        .then(result => result.rows);
}
function getAllSignersByCity(city) {
    return db
        .query(
            `
        SELECT signatures.signature, users.first_name AS first, users.last_name AS last, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
        FROM signatures
        INNER JOIN users
        ON signatures.user_id = users.id
        INNER JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE LOWER(user_profiles.city) = LOWER($1)
    `,
            [city]
        )
        .then(result => result.rows);
}

module.exports = {
    getAllSigners,
    getAllSignersByCity,
};
