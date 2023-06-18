import multer from "multer";
import {addMediaModel, retrieveChildGalleryModel,addMedicalFileModel} from "../model/filesModel.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });

//adds media to baby's gallery
export function addMedia(req, res) {
    upload.single('photo')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
        } else if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error uploading file.' }));
        } else {
            try {
                const { date, type, desc, id } = req.body;
                const file = req.file;

                const result = await addMediaModel(type, file, date, desc, id);

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: result }));
            } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            }
        }
    });
}


//retrieves the baby's galllery
export function retrieveChildGallery(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        try {
            const obj = JSON.parse(body);
            const { child_id } = obj;

            const childData = await retrieveChildGalleryModel(child_id);

            if (childData.images.length === 0) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "no media" }));
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

export function addMedicalFile(req, res) {
    upload.single('pdf')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
        } else if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error uploading file.' }));
        } else {
            try {
                const { id } = req.body;
                const file = req.file;

                const result = await addMedicalFileModel(id, file);

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: result }));
            } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            }
        }
    });
}
