import pool from "../database.js";
import {decryptId} from "./cookieDecrypt.js";

export function handleAddChildToParent(req, res) {
    let idUser = decryptId(req, res);
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const obj = JSON.parse(body);
        const { code } = obj;

        console.log("id child:" + code);
        console.log("user id: " + idUser);

        const checkQuery = {
            text: 'SELECT * FROM users_child_accounts WHERE user_id = $1 AND account_id = $2',
            values: [idUser, code],
        };
        pool.query(checkQuery)
            .then((result) => {
                if (result.rows.length > 0) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: "Child is already added to the parent" }));
                } else {
                    const insertQuery = {
                        text: 'INSERT INTO users_child_accounts (user_id, account_id) VALUES ($1, $2)',
                        values: [idUser, code],
                    };
                    pool.query(insertQuery)
                        .then(() => {
                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: "Relation added successfully" }));
                        })
                        .catch((err) => {
                            console.error(err);
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: 'Server error' }));
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            });
    });
}
