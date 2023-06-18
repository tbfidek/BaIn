import pool from "../database.js";
import {getFile, uploadImage, uploadPDF, uploadVideo} from "../services/s3client.js";


//for adding media to the gallery
export async function addMediaModel(type, file, date, desc, id) {
    let image;
    if (type === "video" || type === "audio") {
        image = await uploadVideo(file);
        type = "video";
    } else {
        image = await uploadImage(file);
    }

    const query = {
        text: 'INSERT INTO child_media(child_account_id,type,media,date,description) VALUES ($1,$2,$3,$4,$5)',
        values: [id, type, image, date, desc],
    };

    try {
        await pool.query(query);
        console.log("galerie");
        return "Picture updated successfully";
    } catch (err) {
        console.error(err);
        throw new Error('Database error');
    }
}

//for sending info to the gallery
export async function retrieveChildGalleryModel(child_id) {
    const childQuery = {
        text: "SELECT * FROM child_media WHERE child_account_id = $1",
        values: [child_id],
    };

    try {
        const childResult = await pool.query(childQuery);

        const childData = {
            type: [],
            images: [],
            date: [],
            desc: [],
        };

        for (const child of childResult.rows) {
            const url = await getFile(child.media);
            childData.images.push(url);
            childData.type.push(child.type);
            childData.date.push(child.date);
            childData.desc.push(child.description);
        }

        console.log(childData);

        return childData;
    } catch (err) {
        console.error(err);
        throw new Error("Database error");
    }
}


export async function addMedicalFileModel(id, file) {
    try {
        const image = await uploadPDF(file);
        const date = new Date();

        const query = {
            text: "INSERT INTO child_medical(child_account_id, file, date) VALUES ($1, $2, $3)",
            values: [id, image, date],
        };

        await pool.query(query);
        console.log("galerie");
        return "Picture updated successfully";
    } catch (err) {
        console.error(err);
        throw new Error('Database error');
    }
}
