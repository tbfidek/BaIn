DROP TABLE IF EXISTS users_child_accounts;
DROP TABLE IF EXISTS child_media;
DROP TABLE IF EXISTS meal_records;
DROP TABLE IF EXISTS nap_records;
DROP TABLE IF EXISTS child_accounts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       user_id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       salt TEXT NOT NULL,
                       profile_image BYTEA
);

CREATE TABLE child_accounts (
                                account_id SERIAL PRIMARY KEY,
                                name VARCHAR(255) NOT NULL,
                                birthday DATE NOT NULL,
                                weight FLOAT NOT NULL,
                                height FLOAT NOT NULL,
                                gender VARCHAR(32) NOT NULL,
                                profile_image BYTEA
);

CREATE TABLE child_media (
                             media_id SERIAL PRIMARY KEY,
                             child_account_id INTEGER REFERENCES child_accounts(account_id),
                             media_type VARCHAR(32) NOT NULL,
                             media_data BYTEA,
                             media_date DATE NOT NULL,
                             description VARCHAR(255)
);

CREATE TABLE users_child_accounts (
                                      id SERIAL PRIMARY KEY,
                                      user_id INTEGER REFERENCES users(user_id),
                                      account_id INTEGER REFERENCES child_accounts(account_id) ON DELETE CASCADE
);

CREATE TABLE meal_records (
                              id SERIAL PRIMARY KEY,
                              child_account_id INTEGER REFERENCES child_accounts(account_id),
                              meal_date DATE NOT NULL,
                              meal_description VARCHAR(255) NOT NULL,
                              meal_type VARCHAR(10) NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
                              meal_option VARCHAR(8) NOT NULL CHECK (meal_option IN ('Liked', 'Disliked', 'Allergy'))
);


CREATE TABLE nap_records (
                             id SERIAL PRIMARY KEY,
                             child_account_id INTEGER REFERENCES child_accounts(account_id),
                             nap_date DATE NOT NULL,
                             start_time TIME NOT NULL,
                             end_time TIME NOT NULL,
                             sleep_quality VARCHAR(5) NOT NULL CHECK (sleep_quality IN ('Great', 'Fussy', 'Bad'))
);


INSERT INTO users (name, email, password, salt)
VALUES ('John Doe', 'john@example.com', 'password123', 'somesalt');

INSERT INTO child_accounts (name, birthday, weight, height, gender)
VALUES ('Sarah Doe', '2020-01-01', 12.5, 70.0, 'Female');

INSERT INTO users_child_accounts (user_id, account_id)
VALUES (1, 1);

INSERT INTO child_media (child_account_id, media_type, media_data, media_date, description)
VALUES (1, 'image', '\x...', '2023-06-01', 'Description of the media');

INSERT INTO meal_records (child_account_id, meal_date, meal_description, meal_type, meal_option)
VALUES (1, '2023-05-08', 'Scrambled eggs and toast', 'Breakfast', 'Liked');

INSERT INTO nap_records (child_account_id, nap_date, start_time, end_time, sleep_quality)
VALUES (1, '2023-05-08', '14:00:00', '15:30:00', 'Great');
