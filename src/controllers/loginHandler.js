import pool from "../database.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export function handleLogin(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", () => {
        const obj = JSON.parse(body);
        const { email, pw } = obj;

        const query = {
            text: "SELECT * FROM users WHERE email = $1",
            values: [email],
        };
        console.log(email);
        pool.query(query)
            .then((result) => {
                if (result.rows.length === 0 || result.rows[0] === "") {
                    res.statusCode = 401;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: "Add your credentials" }));
                    return;
                } else {
                    const user = result.rows[0];
                    const salt = user.salt;
                    const combinedPassword = pw + salt;
                    const hashedPassword = crypto
                        .createHash("sha256")
                        .update(combinedPassword)
                        .digest("hex");

                    if (user.password === hashedPassword) {
                        res.statusCode = 302;
                        res.setHeader("Location", "http://localhost:3000/views/main.html");
                        const loggedToken = jwt.sign({ logged: true }, "secretKey", { expiresIn: "30d" });
                        const loggedCookie = `loggedToken=${loggedToken}; Path=/; HttpOnly; Secure`;
                        const idToken = jwt.sign({ userId: user.user_id }, "secretKey", { expiresIn: "30d" });
                        const tokenCookie = `idToken=${idToken}; Path=/; HttpOnly; Secure`;
                        console.log("token " + idToken);
                        res.setHeader("Set-Cookie", [loggedCookie, tokenCookie]);

                        jwt.verify(idToken, "secretKey", (err, decoded) => {
                            if (err) {
                                // Token verification failed
                                res.statusCode = 401;
                                res.setHeader("Content-Type", "application/json");
                                res.end(JSON.stringify({ message: "Invalid token" }));
                                return;
                            }

                            const userId = decoded.userId;
                            console.log("decoded token: " + userId);
                        });

                        res.end();
                    } else {
                        res.statusCode = 401;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: "Invalid credentials" }));
                        return;
                    }
                }
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Server error" }));
                return;
            });
    });
}
