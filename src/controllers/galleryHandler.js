import multer from "multer";
import pool from "../database.js";
import {uploadFile} from "../services/s3client.js";
const storage = multer.memoryStorage();
const upload = multer({storage});

export function addMedia(req, res) {
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
            let { date,type,desc, id } = req.body;
            console.log("req body" + date + id);
            let image = await uploadFile(req.file);
            const query = {
                text: 'INSERT INTO child_media(child_account_id,type,media,date,description) VALUES ($1,$2,$3,$4,$5)',
                values: [id,type,image,date,desc],
            };
            pool.query(query)
                .then(() => {
                    console.log("galerie");
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