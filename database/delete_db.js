const db = require('./db_init');

function deleteUser(userId) {
    return deleteSignature(userId).then(() => {
        return db
            .query(
                `
        DELETE FROM user_profiles
        WHERE user_id = $1`,
                [userId]
            )
            .then(() => {
                return db.query(
                    `
        DELETE FROM users
        WHERE id = $1
        `,
                    [userId]
                );
            });
    });
}

function deleteSignature(userId) {
    return db.query(
        `
        DELETE FROM signatures
        WHERE user_id = $1`,
        [userId]
    );
}

module.exports = {
    deleteUser,
    deleteSignature,
};
