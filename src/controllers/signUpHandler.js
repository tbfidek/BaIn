import pool from "../database.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
export function handleSignUp(req, res){
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const obj = JSON.parse(body);
        const { username, email, pw } = obj;
        const salt = crypto.randomBytes(16).toString('hex');
        const combinedPassword = pw + salt;

        const hashedPassword = crypto
            .createHash('sha256')
            .update(combinedPassword)
            .digest('hex');
        let id_p = -1;
        const query2 = {
            text: 'SELECT MAX(user_id) from users',
        };
        pool.query(query2).then((ans) => {
            id_p = ans.rows[0].max;
        });
        const query = {
            text: 'INSERT INTO users (name, email, password, salt) VALUES ($1, $2, $3, $4)',
            values: [username, email, hashedPassword, salt],
        };
        pool.query(query)
            .then(() => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                const loggedToken = jwt.sign({ logged: true }, "secretKey", { expiresIn: "30d" });
                const loggedCookie = `loggedToken=${loggedToken}; Path=/; HttpOnly; Secure`;
                const idToken = jwt.sign({ userId: id_p + 1}, "secretKey", { expiresIn: "30d" });
                const tokenCookie = `idToken=${idToken}; Path=/; HttpOnly; Secure`;

                res.setHeader("Set-Cookie", [loggedCookie, tokenCookie]);
                res.end(JSON.stringify({ message: 'User created successfully', id: id_p + 1 }));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            });
    });
}