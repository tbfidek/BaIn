import {decryptId} from "./cookieDecrypt.js";
import pool from "../database.js";
import crypto from "crypto";
import {uploadImage} from "../services/s3client.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({storage});

export function updateUserName(req, res) {
    let userId = decryptId(req,res);
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { name } = JSON.parse(body);

        const query = {
            text: 'UPDATE users SET name = $1 WHERE user_id = $2',
            values: [name, userId],
        };
        pool.query(query)
            .then(() => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: "Name updated successfully"}));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            });

    });
}

export function updateUserEmail(req, res) {
    let userId = decryptId(req, res);
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { email } = JSON.parse(body);

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
            .then((result) => {
                if (result.rows.length > 0) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: "Email already exists" }));
                } else {

                    const updateQuery = {
                        text: 'UPDATE users SET email = $1 WHERE user_id = $2',
                        values: [email, userId],
                    };
                    pool.query(updateQuery)
                        .then(() => {
                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: "Email updated successfully" }));
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


export function updateUserPassword(req, res) {
    let userId = decryptId(req,res);
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { password } = JSON.parse(body);
        const salt = crypto.randomBytes(16).toString('hex');
        const combinedPassword = password + salt;

        const hashedPassword = crypto
            .createHash('sha256')
            .update(combinedPassword)
            .digest('hex');

        const query = {
            text: 'UPDATE users SET password = $1, salt = $2 WHERE user_id = $3',
            values: [hashedPassword, salt, userId],
        };
        pool.query(query)
            .then(() => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: "Password updated successfully"}));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            });

    });
}
export function updatePicture(req, res) {
    console.log("am intrat");
    upload.single('photo')(req, res, async err => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred during the upload
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: err.message}));
        } else if (err) {
            // An unknown error occurred during the upload
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(
                JSON.stringify({message: 'Error uploading file.'})
            );
        }
        else{
            let userId = decryptId(req,res);
                let image = await uploadImage(req.file);
                const query = {
                    text: 'UPDATE users SET profile_image = $1 WHERE user_id = $2',
                    values: [image, userId],
                };
                pool.query(query)
                    .then(() => {
                        console.log("MERGE UPDATE UUUUUUUUL DE POZAAA");
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({message: "Picture updated successfully"}));
                    })
                    .catch((err) => {
                        console.error(err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({message: 'Server error'}));
                    });

        }
    });

}