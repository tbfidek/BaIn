import pool from "../database.js";
import multer from "multer";
import {uploadImage} from "../services/s3client.js";
const storage = multer.memoryStorage();
const upload = multer({storage});
export function handleAddChild(req,res){
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
                const { name, birthday, height, weight, gender } = req.body;
                const image = req.file;

                let id_c = -1;
                const query2 = {
                    text: 'SELECT MAX(account_id) from child_accounts',
                };
                pool.query(query2).then((ans) => {
                    if (ans.rows[0].max === null) {
                        id_c = 0;
                    } else {
                        id_c = ans.rows[0].max;
                    }
                });

                console.log("alo" + image);
                let img = await uploadImage(image);

                const query = {
                    text: 'INSERT INTO child_accounts (name, birthday, weight, height, gender,profile_image) VALUES ($1, $2, $3, $4, $5,$6)',
                    values: [name, birthday, weight, height, gender, img],
                };
                pool.query(query)
                    .then(() => {
                        console.log("POZA LA BEBE");
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({message: "Child added successfully", id: id_c + 1}));
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