import pool from "../database.js";
import multer from "multer";
import {decryptId} from "./cookieDecrypt.js";
import {uploadImage} from "../services/s3client.js";
const storage = multer.memoryStorage();
const upload = multer({storage});

export function updateChild(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {
            child_id,
            new_name,
            new_birthday,
            new_weight,
            new_height,
            new_gender,
            new_profile_image
        } = JSON.parse(body);
        const query = {
            text: 'UPDATE child_accounts SET name = $1, birthday = $2, weight = $3, height = $4, gender = $5, profile_image = $6 WHERE account_id = $7',
            values: [new_name, new_birthday, new_weight, new_height, new_gender, new_profile_image, child_id],
        };
        pool.query(query)
            .then(() => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: "Child data updated successfully"}));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            });

    });
}

export function updateBabyPicture(req, res) {
    console.log("am intrat" + req.body);
    upload.single('photo')(req, res, async err => {
        if (err instanceof multer.MulterError) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: err.message}));
        } else if (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(
                JSON.stringify({message: 'Error uploading file.'})
            );
        }
        else{
            let { id } = req.body;
            // console.log("req body" + id);
            let image = await uploadImage(req.file);
            const query = {
                text: 'UPDATE child_accounts SET profile_image = $1 WHERE account_id = $2',
                values: [image, id],
            };
            pool.query(query)
                .then(() => {
                    console.log("MERGE UPDATE UUUUUUUUL DE POZAAA bebel");
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