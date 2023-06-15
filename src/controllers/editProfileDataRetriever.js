import pool from "../database.js";
import { decryptId } from "./cookieDecrypt.js";
import {getFile} from "../services/s3client.js";

export function retrieveUserData(req, res) {
    const userId = decryptId(req, res);

    const userQuery = {
        text: "SELECT * FROM users WHERE user_id = $1",
        values: [userId],
    };

    console.log("id parinte: " + userId);
    const childrenQuery = {
        text: `
            SELECT c.account_id AS child_id, c.name AS child_name
            FROM child_accounts AS c
            JOIN users_child_accounts AS uca ON c.account_id = uca.account_id
             WHERE uca.user_id = $1
        `,
        values: [userId],
    };

    Promise.all([pool.query(userQuery), pool.query(childrenQuery)])
        .then(async ([userResult, childrenResult]) => {
            if (userResult.rows.length === 0) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "User not found" }));
                return;
            }

            const user = userResult.rows[0];
            const url = await getFile(user.profile_image);
            const children = childrenResult.rows;
            console.log(children);
            const userData = {
                id: userId,
                name: user.name,
                email: user.email,
                children: children,
                profile_image: url
            };

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(userData));
        })
        .catch((err) => {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Server error" }));
            return;
        });
}