import pool from "../database.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export async function addUser(user){
    return await pool.query('SELECT * FROM users WHERE email = $1', [user.email])
        .then(async (result) => {
            if (result.rows.length > 0) {
                return {message: "Email already has an account"};
            } else {
                const salt = crypto.randomBytes(16).toString('hex');
                const combinedPassword = user.password + salt;
                const hashedPassword = crypto
                    .createHash('sha256')
                    .update(combinedPassword)
                    .digest('hex');

                let id_p = -1;
                const query2 = {
                    text: 'SELECT MAX(user_id) from users',
                };
                const maxResult = await pool.query(query2)
                    .then(async (ans) => {
                        id_p = ans.rows[0].max;

                        const query = {
                            text: 'INSERT INTO users (name, email, password, salt, profile_image) VALUES ($1, $2, $3, $4, $5)',
                            values: [user.username, user.email, hashedPassword, salt, user.image],
                        };
                        const insertResult = await pool.query(query)
                            .then(() => {
                                // const loggedToken = jwt.sign({logged: true}, "secretKey", {expiresIn: "30d"});
                                // const loggedCookie = `loggedToken=${loggedToken}; Path=/; HttpOnly; Secure`;
                                // const idToken = jwt.sign({userId: id_p + 1}, "secretKey", {expiresIn: "30d"});
                                // const tokenCookie = `idToken=${idToken}; Path=/; HttpOnly; Secure`;
                                //
                                // res.setHeader("Set-Cookie", [loggedCookie, tokenCookie]);
                                return {message: 'User created successfully', id: id_p + 1};
                            })
                            .catch((err) => {
                                return {message: 'Server error'};
                            });
                        return insertResult;
                    })
                    .catch((err) => {
                        return {message: 'Server error'};
                    });
                return maxResult;
            }
        })
        .catch((err) => {
            return {message: 'Server error'};
        });
}

export async function checkLogin(userData){
    const query = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [userData.email],
    };
    const result = await pool.query(query)
        .then((result) => {
            if (result.rows.length === 0 || result.rows[0] === "") {
                return { message: "Add your credentials" };
            } else {
                const user = result.rows[0];
                const salt = user.salt;
                const combinedPassword = userData.pw + salt;
                const hashedPassword = crypto
                    .createHash("sha256")
                    .update(combinedPassword)
                    .digest("hex");
                console.log("PAROLAAAAAAAAA BD " + user.password + " PAROLAAA PRIMITA " + hashedPassword);
                if (user.password === hashedPassword) {
                    const loggedToken = jwt.sign({ logged: true }, "secretKey", { expiresIn: "30d" });
                    const loggedCookie = `loggedToken=${loggedToken}; Path=/; HttpOnly; Secure`;
                    const idToken = jwt.sign({ userId: user.user_id }, "secretKey", { expiresIn: "30d" });
                    const tokenCookie = `idToken=${idToken}; Path=/; HttpOnly; Secure`;
                    console.log("token " + idToken);

                    jwt.verify(idToken, "secretKey", (err, decoded) => {
                        if (err) {
                            return { message: "Invalid token" };
                        }

                        const userId = decoded.userId;
                        console.log("decoded token: " + userId);

                    });
                    return { message: "logged", loggedCookie: loggedCookie, tokenCookie: tokenCookie };
                } else {
                    return { message: "Invalid credentials" };
                }
            }
        })
        .catch((err) => {
            return { message: "Server error" };
        });
    return result;
}

export function logout() {

    const loggedToken = jwt.sign({ logged: false }, "secretKey", { expiresIn: "30d" });
    const loggedCookie = `loggedToken=${loggedToken}; Path=/; HttpOnly; Secure`;
    const idToken = jwt.sign({ userId: -1 }, "secretKey", { expiresIn: "30d" });
    const tokenCookie = `idToken=${idToken}; Path=/; HttpOnly; Secure`;
    return {loggedCookie, tokenCookie};
}
