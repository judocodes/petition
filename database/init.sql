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