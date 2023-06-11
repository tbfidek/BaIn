import pool from "../database.js";
import crypto from "crypto";

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
                    console.log(result.rows[0]);
                    console.log("login pass:" + pw);
                    const user = result.rows[0];
                    const salt = user.salt;

                    const combinedPassword = pw + salt;

                    const hashedPassword = crypto
                        .createHash("sha256")
                        .update(combinedPassword)
                        .digest("hex");

                    console.log(user.salt);
                    console.log(hashedPassword);
                    console.log(user.password);

                    //dc nu matchuieste parola aici
                    if (user.password) {
                        res.statusCode = 302;
                        res.setHeader("Location", "http://localhost:3000/views/main.html");
                        const loggedInCookie = `loggedIn=true; Path=/; HttpOnly; Secure`;
                        const userIdCookie = `userId=${user.user_id}; Path=/; HttpOnly; Secure`;

                        res.setHeader("Set-Cookie", [loggedInCookie, userIdCookie]);
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
