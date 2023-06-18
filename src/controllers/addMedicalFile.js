import multer from "multer";
import pool from "../database.js";
import {uploadImage, uploadPDF, uploadVideo} from "../services/s3client.js";
const storage = multer.memoryStorage();
const upload = multer({storage});

export function addMedicalFile(req, res) {
    upload.single('pdf')(req, res, async err => {
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

            let image = await uploadPDF(req.file);
            let date = new Date();

            const query = {
                text: "INSERT INTO child_medical(child_account_id, file, date) VALUES ($1, $2, $3)",
                values: [id, image, date],
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