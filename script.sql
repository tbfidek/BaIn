DROP table IF EXISTS users_child_accounts;
DROP table IF EXISTS child_accounts;
DROP table IF EXISTS users;

CREATE TABLE users (
                       user_id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL
);

CREATE TABLE child_accounts (
                                account_id SERIAL PRIMARY KEY,
                                name VARCHAR(255) NOT NULL,
                                birthday DATE NOT NULL,
                                weight FLOAT NOT NULL,
                                height FLOAT NOT NULL
);

CREATE TABLE users_child_accounts (
                                      id SERIAL PRIMARY KEY,
                                      user_id INTEGER REFERENCES users(user_id),
                                      account_id INTEGER REFERENCES child_accounts(account_id)
);
INSERT INTO users (name, email, password) VALUES
                                              ('John Doe', 'johndoe@example.com', 'password123'),
                                              ('Jane Smith', 'janesmith@example.com', 'password456'),
                                              ('Bob Johnson', 'bobjohnson@example.com', 'password789');

INSERT INTO child_accounts (name, birthday, weight, height) VALUES
                                                                ('John Doe JR.', '2020-05-15', 6.2, 50),
                                                                ('Jane Doe JR.', '2019-02-28', 10.5, 70),
                                                                ('Bob Johnson JR.', '2018-07-01', 15.3, 90);
INSERT INTO users_child_accounts (user_id, account_id) VALUES
                                                           (1, 1),
                                                           (1, 2),
                                                           (2, 3),
                                                           (3, 1);

