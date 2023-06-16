import pool from "../database.js";
import {getFile} from "../services/s3client.js";

export function retrieveChildGallery(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", () => {
        const obj = JSON.parse(body);
        const { child_id } = obj;

        const childQuery = {
            text: "SELECT * FROM child_media WHERE child_account_id = $1",
            values: [child_id],
        };

        pool.query(childQuery)
            .then(async (childResult) => {
                if (childResult.rows.length === 0) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: "no media" }));
                    return;
                }

                const child = childResult.rows[0];
                const childData = {
                    type: [],
                    images: [],
                    date: [],
                    desc: []
                };

                for (const child of childResult.rows) {
                    const url = await getFile(child.media);
                    childData.images.push(url);
                    childData.type.push(child.type);
                    childData.date.push(child.date);
                    childData.desc.push(child.description);
                }

                console.log(childData);

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(childData));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Server error" }));
            });
    });
}
