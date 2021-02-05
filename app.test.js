const request = require('supertest');
const app = require('./app');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const { getUserByEmail } = require('./database/db');
const db = require('./database/db_init');
const bcrypt = require('./utils/bcrypt');

beforeEach(async () => {
    const pass = await bcrypt.hash('willi12345');

    await db.query(`
        DROP TABLE IF EXISTS user_profiles;
        DROP TABLE IF EXISTS signatures;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            id SERIAL primary key,
            first_name VARCHAR(75) NOT NULL CHECK (first_name != ''),
            last_name VARCHAR(75) NOT NULL CHECK (last_name != ''),
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE signatures (
            id SERIAL primary key,
            signature TEXT NOT NULL CHECK (LENGTH(signature) > 15),
            user_id INT NOT NULL UNIQUE REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE user_profiles (
            id SERIAL primary key,
            user_id INT NOT NULL UNIQUE REFERENCES users(id),
            age INT,
            city VARCHAR(255),
            url VARCHAR(255)
        )
    `);

    await db.query(
        `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ('Willi', 'Willi', 'willi@willi.com', $1)
        `,
        [pass]
    );
});

test('Logged Out User | /petition => redirect to /register', () => {
    return request(app)
        .get('/petition')
        .then(res => {
            expect(res.headers.location).toBe('/register');
        });
});

test('Logged In User | /register  => redirect to /petition', () => {
    cookieSession.mockSessionOnce({
        userId: 1,
    });

    request(app).get('/register').expect('location', '/petition');
});

test('Logged In User | /login  => redirect to /petition', () => {
    cookieSession.mockSessionOnce({
        userId: 1,
    });

    request(app).get('/login').expect('location', '/petition');
});

test('Logged In + Signed User | GET /petition => redirect to /thanks', () => {
    cookieSession.mockSessionOnce({
        userId: 1,
        signed: true,
    });

    request(app).get('/petition').expect('location', '/thanks');
});

test('Logged In + Signed User | POST signature => redirect to /thanks', () => {
    cookieSession.mockSessionOnce({
        userId: 1,
        signed: true,
    });

    request(app)
        .post('/petition')
        .send({
            signature:
                'sx65ecdrvtiopüq 5e46poq 5fr67gt8hz9ju0ioßa  t67g8hz9jui072',
        })
        .expect('location', '/thanks');
});

test('Logged In + NOT Signed User | /signers => redirect to /petition', () => {
    cookieSession.mockSessionOnce({
        userId: 1,
        signed: false,
    });

    request(app).get('/signers').expect('location', 'petition');
});

test('Logged In + NOT Signed User | /thanks => redirect to /petition', () => {
    cookieSession.mockSessionOnce({
        userId: 1,
        signed: false,
    });

    return request(app).get('/thanks').expect('location', '/petition');
});

test('Log In User => redirect to /petition', () => {
    cookieSession.mockSessionOnce({
        userId: '',
        signed: false,
    });

    return request(app)
        .post('/login')
        .send({
            email: 'willi@willi.com',
            password: 'willi12345',
        })
        .expect('location', '/petition');
});

test('Updated Password should be entered correctly in database', () => {
    cookieSession.mockSessionOnce({
        userId: 1,
        signed: false,
    });

    return request(app)
        .post('/profile/edit')
        .send({
            first: 'Willi',
            last: 'Willi',
            email: 'willi@willi.com',
            password: 'willi54321',
            match: 'willi54321',
        })
        .then(() =>
            getUserByEmail('willi@willi.com').then(user => {
                if (!user) {
                    throw new Error('User information incorrect.');
                }

                return bcrypt
                    .compare('willi54321', user.password)
                    .then(isValid => {
                        expect(isValid).toBe(true);
                    });
            })
        );
});

test('Not Updating password should keep the old password intact.', async () => {
    return request(app)
        .post('/profile/edit')
        .send({
            password: 'anypass12345',
        })
        .then(() =>
            getUserByEmail('willi@willi.com').then(user => {
                if (!user) {
                    throw new Error('User information incorrect.');
                }

                return bcrypt
                    .compare('willi12345', user.password)
                    .then(isValid => {
                        expect(isValid).toBe(true);
                    });
            })
        );
});

test('Logged In | Good Signature => Redirect to /thanks', () => {
    cookieSession.mockSessionOnce({
        signed: false,
        userId: 1,
    });
    request(app)
        .post('/petition')
        .send({
            signature: '2345r6t78z9u0ioß9i8uztre',
        })
        .expect('location', '/thanks');
});

test('Logged In | Bad Signature => Error in response.body', () => {
    cookieSession.mockSessionOnce({
        signed: false,
        userId: 1,
    });

    return request(app)
        .post('/petition')
        .send({})
        .catch(e => {
            expect(e).not.toBeUndefined();
        });
});
