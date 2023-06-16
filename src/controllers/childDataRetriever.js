import pool from "../database.js";
import {getFile} from "../services/s3client.js";

export function retrieveChildData(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", () => {
        const obj = JSON.parse(body);
        const {user_id, child_id} = obj;
        console.log("USER ID " + user_id + " CHILDF ID " + child_id)
        const childQuery = {
            text: "SELECT c.* FROM child_accounts c JOIN users_child_accounts u ON u.user_id = $1 WHERE c.account_id = $2",
            values: [user_id, child_id],
        };

        Promise.all([pool.query(childQuery)])
            .then(async ([childResult]) => {
                if (childResult.rows.length === 0) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({message: "Child not found"}));
                    return;
                }
                const child = childResult.rows[0];
                // console.log("childDataRetriever: " + child.birthday)

                const url = await getFile(child.profile_image);

                const childData = {
                    id: child.account_id,
                    name: child.name,
                    birthday: child.birthday,
                    weight: child.weight,
                    height: child.height,
                    gender: child.gender,
                    image: url,
                    image_code: child.profile_image
                };

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(childData));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({message: "Server error"}));
                return;
            });
    });
}
