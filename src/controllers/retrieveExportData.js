import pool from "../database.js";
import { decryptId } from "./cookieDecrypt.js";

export function retrieveExportData(req, res) {
    const userId = decryptId(req, res);{
        const childQuery = {
            text: "SELECT * FROM child_accounts WHERE account_id IN ( SELECT account_id FROM users_child_accounts WHERE user_id = $1)",
            values: [userId],
        };
        Promise.all([pool.query(childQuery)])
            .then(async ([childResult]) => {
                console.log("LUNGIME CP: " + childResult.rows.length);
                if (childResult.rows.length === 0) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({message: "Child not found"}));
                    return;
                }
                const child = childResult.rows;
                const data = [];
                for(let i = 0; i < child.length; ++i){
                    const napQuery = `
                    SELECT nap_date, start_time, end_time, sleep_quality
                    FROM nap_records
                    WHERE child_account_id = $1
                    `;
                    const napResult = await pool.query(napQuery, [child[i].account_id]);
                    const mealQuery = `
                    SELECT meal_date, meal_description, meal_type, meal_option
                    FROM meal_records
                    WHERE child_account_id = $1
                    `;
                    const mealResult = await pool.query(mealQuery, [child[i].account_id]);
                    const mediaQuery = `
                  SELECT type, media, date, description
                  FROM child_media
                  WHERE child_account_id = $1
                  `;
                    const mediaResult = await pool.query(mediaQuery, [child[i].account_id]);
                    const childData = {
                        name: child[i].name,
                        birthday: child[i].birthday,
                        weight: child[i].weight,
                        height: child[i].height,
                        gender: child[i].gender,
                        image_code: child[i].profile_image,
                        media: mediaResult.rows,
                        meal_records: mealResult.rows,
                        nap_records: napResult.rows
                    };
                    console.log("TEEEEEEEEEEEEEEEEEEEEEEEEEEEEST: "+ childData.meal_records);
                    data.push(childData);
                }

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({message: "Server error"}));
                return;
            });
    }
}