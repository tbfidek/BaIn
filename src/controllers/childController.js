import pool from "../database.js";
import multer from "multer";
import {uploadImage} from "../services/s3client.js";
import {decryptId} from "./cookieDecrypt.js";
import * as childModel from "../model/childModel.js";
import {retrieveChildDataModel} from "../model/childModel.js";

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

            console.log("alo" + image);
            let img = await uploadImage(image);
            let child = {
                name: name,
                birthday: birthday,
                weight: weight,
                height: height,
                gender: gender,
                img: img
            };

            let data = await childModel.addChild(child);
            if(data.message != "Server error"){
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: data.message, id: data.id}));
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: data.message}));
            }
        }
    });
}

export function handleAddChildToParent(req, res) {
    let idUser = decryptId(req, res);
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const obj = JSON.parse(body);
        const { child_id } = obj;

        console.log("id child:" + child_id);
        console.log("user id: " + idUser);

        let data = await childModel.addChildConnection(idUser, child_id);
        if(data.message != "Server error"){
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message}));
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message}));
        }
    });
}

export function handleDeleteChild(req,res){
    let idUser = decryptId(req,res);
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const obj = JSON.parse(body);
        const { code } = obj;
        console.log("sterg copilu: " + code + "cu parintele :" + idUser);

        let data = await childModel.deleteChildConnection(idUser, code);
        if(data.message != "Server error"){
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message}));
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message}));
        }
    });
}

export function handleUpdateChild(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const {
            child_id,
            new_name,
            new_birthday,
            new_weight,
            new_height,
            new_gender,
            new_profile_image
        } = JSON.parse(body);
        let child = {
            child_id: child_id,
            new_name: new_name,
            new_birthday: new_birthday,
            new_weight: new_weight,
            new_height: new_height,
            new_gender: new_gender,
            new_profile_image: new_profile_image
        };

        let data = await childModel.updateChild(child);
        if(data.message != "Server error"){
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message}));
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message}));
        }

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

export function handleImportChild(req,res){
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { name, birthday, height, weight, gender, photo, media, nap_records, meal_records, parent_id} = JSON.parse(body);
        let child = {
            name: name,
            birthday: birthday,
            height: height,
            weight: weight,
            gender: gender,
            photo: photo,
            media: media,
            nap_records: nap_records,
            meal_records: meal_records,
            parent_id: parent_id
        }

        let data = await childModel.importChild(child);
        if(data.message != "Server error"){
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message, id: data.id}));
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message}));
        }
    });
}

export async function retrieveExportData(req, res) {
    const userId = decryptId(req, res);

    let data = await childModel.exportChild(userId);
    console.log(data);
    if(data.message != "Server error"){
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({data: data.json, csvContent: data.csv}));
    } else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({message: data.message}));
    }
}

export function retrieveChildData(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        try {
            const obj = JSON.parse(body);
            const { user_id, child_id } = obj;

            const childData = await retrieveChildDataModel(user_id, child_id);

            if (!childData) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Child not found" }));
                return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(childData));
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Server error" }));
        }
    });
}
