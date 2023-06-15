import pool from "../database.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {uploadFile} from "../services/s3client.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({storage});
export function handleSignUp(req, res) {
    upload.single('photo')(req, res, async err => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred during the upload
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
        }
        else if (err) {
            // An unknown error occurred during the upload
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({ message: 'Error uploading file.' })
            );
        }
        else{
                const { username, email, password } = req.body;

                //email validation regex pattern
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                console.log(email);
                if (!emailPattern.test(email)) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: "Invalid email format" }));
                    return;
                }

                const checkQuery = {
                    text: 'SELECT * FROM users WHERE email = $1',
                    values: [email],
                };
                pool.query(checkQuery)
                    .then(async (result) => {
                        if (result.rows.length > 0) {
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({message: "Email already has an account"}));
                        } else {
                            const salt = crypto.randomBytes(16).toString('hex');
                            const combinedPassword = password + salt;
                            const hashedPassword = crypto
                                .createHash('sha256')
                                .update(combinedPassword)
                                .digest('hex');

                            let id_p = -1;
                            const query2 = {
                                text: 'SELECT MAX(user_id) from users',
                            };

                            let image = await uploadFile(req.file);
                            pool.query(query2)
                                .then((ans) => {
                                    id_p = ans.rows[0].max;

                                    const query = {
                                        text: 'INSERT INTO users (name, email, password, salt,profile_image) VALUES ($1, $2, $3, $4,$5)',
                                        values: [username, email, hashedPassword, salt, image],
                                    };
                                    pool.query(query)
                                        .then(() => {
                                            res.statusCode = 201;
                                            res.setHeader('Content-Type', 'application/json');
                                            const loggedToken = jwt.sign({logged: true}, "secretKey", {expiresIn: "30d"});
                                            const loggedCookie = `loggedToken=${loggedToken}; Path=/; HttpOnly; Secure`;
                                            const idToken = jwt.sign({userId: id_p + 1}, "secretKey", {expiresIn: "30d"});
                                            const tokenCookie = `idToken=${idToken}; Path=/; HttpOnly; Secure`;

                                            res.setHeader("Set-Cookie", [loggedCookie, tokenCookie]);
                                            res.end(JSON.stringify({
                                                message: 'User created successfully',
                                                id: id_p + 1
                                            }));
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            res.statusCode = 500;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.end(JSON.stringify({message: 'Server error'}));
                                        });
                                })
                                .catch((err) => {
                                    console.error(err);
                                    res.statusCode = 500;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify({message: 'Server error'}));
                                });
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Server error' }));
                    });
            }
    });

}
