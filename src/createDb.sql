DROP table IF EXISTS users_child_accounts;
DROP table IF EXISTS child_accounts;
DROP table IF EXISTS users;

CREATE TABLE users (
                       user_id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       salt TEXT NOT NULL
);

CREATE TABLE child_accounts (
                                account_id SERIAL PRIMARY KEY,
                                name VARCHAR(255) NOT NULL,
                                birthday DATE NOT NULL,
                                weight FLOAT NOT NULL,
                                height FLOAT NOT NULL,
                                gender VARCHAR(32) NOT NULL
);

CREATE TABLE users_child_accounts (
                                      id SERIAL PRIMARY KEY,
                                      user_id INTEGER REFERENCES users(user_id),
                                      account_id INTEGER REFERENCES child_accounts(account_id)
                                      ON DELETE CASCADE
);
