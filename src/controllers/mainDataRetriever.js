import pool from "../database.js";
import { decryptId } from "./cookieDecrypt.js";

export function retrieveUserName(req, res) {
    const userId = decryptId(req, res);

    const userQuery = {
        text: "SELECT * FROM users WHERE user_id = $1",
        values: [userId],
    };

    Promise.all([pool.query(userQuery)])
        .then(([userResult]) => {
            if (userResult.rows.length === 0) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "User not found" }));
                return;
            }

            const user = userResult.rows[0];
            const userData = {
                name: user.name
            };
            console.log(user.name);
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
