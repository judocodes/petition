const db = require('./db_init');
const bcrypt = require('../utils/bcrypt');

function updateUserProfile(userId, updatedUser) {
    let { first, last, email, password, city, age, url } = updatedUser;

    if (url && !url.startsWith('http')) {
        url = 'http://' + url;
    }

    const updatingTasks = [];

    // Change users based on profile info
    updatingTasks.push(
        db
            .query(
                `
        INSERT INTO users (id, first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4, 'someval')
        ON CONFLICT (id)
        DO UPDATE SET first_name = $2, last_name = $3, email = $4
        RETURNING 
            first_name as first,
            last_name as last,
            email`,
                [userId, first, last, email]
            )
            .then(result => result.rows[0])
    );

    // change user additional infos
    updatingTasks.push(
        db
            .query(
                `
        UPDATE user_profiles
        SET city = $1, age = $2, url = $3
        WHERE user_id = $4
        RETURNING city, age, url
        `,
                [city, age, url, userId]
            )
            .then(result => result.rows[0])
    );

    // change password only if altered
    // password will be null if unaltered
    if (password != null) {
        updatingTasks.push(
            bcrypt.hash(password).then(hashedPw =>
                db.query(
                    `
            UPDATE users
            SET password = $1
            WHERE id = $2
        `,
                    [hashedPw, userId]
                )
            )
        );
    }

    return Promise.all(updatingTasks).then(results => {
        return { ...results[0], ...results[1] };
    });
}

module.exports = { updateUserProfile };

/*
Before UPSERT 40 {
  _csrf: 'mLp9LhQ2-bttHgxg9ZPDGBrbZ403XXBkR__w',
  first: 'user17',
  last: 'user17',
  email: 'newuser20@user.com',
  city: '',
  age: '',
  url: '',
  password: 'something',
  match: 'something'
}
*/
