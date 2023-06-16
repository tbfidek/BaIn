DROP TABLE IF EXISTS users_child_accounts;
DROP TABLE IF EXISTS child_media;
DROP TABLE IF EXISTS meal_records;
DROP TABLE IF EXISTS nap_records;
DROP TABLE IF EXISTS child_medical;
DROP TABLE IF EXISTS child_accounts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       user_id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       salt TEXT NOT NULL,
                       profile_image VARCHAR(255)
);

CREATE TABLE child_accounts (
                                account_id SERIAL PRIMARY KEY,
                                name VARCHAR(255) NOT NULL,
                                birthday DATE NOT NULL,
                                weight FLOAT NOT NULL,
                                height FLOAT NOT NULL,
                                gender VARCHAR(32) NOT NULL,
                                profile_image VARCHAR(255)
);

CREATE TABLE child_media (
                             media_id SERIAL PRIMARY KEY,
                             child_account_id INTEGER REFERENCES child_accounts(account_id),
                             type VARCHAR(32) NOT NULL,
                             media VARCHAR(255),
                             date DATE NOT NULL,
                             description VARCHAR(255)
);

CREATE TABLE child_medical (
                               medical_id SERIAL PRIMARY KEY,
                               child_account_id INTEGER REFERENCES child_accounts(account_id),
                               date DATE,
                               file VARCHAR(255)
);

CREATE TABLE users_child_accounts (
                                      id SERIAL PRIMARY KEY,
                                      user_id INTEGER REFERENCES users(user_id),
                                      account_id INTEGER REFERENCES child_accounts(account_id) ON DELETE CASCADE
);

CREATE TABLE meal_records (
                              id SERIAL PRIMARY KEY,
                              user_id INTEGER REFERENCES users(user_id),
                              child_account_id INTEGER REFERENCES child_accounts(account_id),
                              meal_date DATE NOT NULL,
                              meal_description VARCHAR(255) NOT NULL,
                              meal_type VARCHAR(10) NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
                              meal_option VARCHAR(8) NOT NULL CHECK (meal_option IN ('Liked', 'Disliked', 'Allergy'))
);


CREATE TABLE nap_records (
                             id SERIAL PRIMARY KEY,
                             user_id INTEGER REFERENCES users(user_id),
                             child_account_id INTEGER REFERENCES child_accounts(account_id),
                             nap_date DATE NOT NULL,
                             start_time TIME NOT NULL,
                             end_time TIME NOT NULL,
                             sleep_quality VARCHAR(5) NOT NULL CHECK (sleep_quality IN ('Great', 'Fussy', 'Bad'))
);