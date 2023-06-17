import pool from "../database.js";

export function handleImportChild(req,res){
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const obj = JSON.parse(body);
        const { name, birthday, height, weight, gender, photo, media, nap_records, meal_records, parent_id} = obj;
        let id_c = -1;
        const query2 = {
            text: 'SELECT COALESCE (MAX(account_id), 0) FROM child_accounts',
        };
        pool.query(query2).then((ans) => {
            //if (ans.rows[0].max === null) {
            //    id_c = 0;
            //} else {
            id_c = ans.rows[0].coalesce;
            //}
        });

        const query = {
            text: 'INSERT INTO child_accounts (name, birthday, weight, height, gender, profile_image) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [name, birthday, weight, height, gender, photo],
        };
        pool.query(query)
            .then(() => {
                //user_id | child_account_id | meal_date  | meal_description | meal_type | meal_option
                for(let i = 0; i < meal_records.length; ++i){
                    const meal_query = {
                        text: 'INSERT INTO meal_records (user_id, child_account_id, meal_date, meal_description, meal_type, meal_option) VALUES ($1, $2, $3, $4, $5, $6)',
                        values: [parent_id, id_c+1, meal_records[i].meal_date, meal_records[i].meal_description, meal_records[i].meal_type, meal_records[i].meal_option],
                    };
                    pool.query(meal_query).then((ans) => {

                    });
                }
                for(let i = 0; i < nap_records.length; ++i){
                    const nap_query = {
                        text: 'INSERT INTO nap_records (user_id, child_account_id, nap_date, start_time, end_time, sleep_quality) VALUES ($1, $2, $3, $4, $5,$6)',
                        values: [parent_id, id_c+1, nap_records[i].nap_date, nap_records[i].start_time, nap_records[i].end_time, nap_records[i].sleep_quality],
                    };
                    pool.query(nap_query).then((ans) => {

                    });
                }
                for(let i = 0; i < media.length; ++i){
                    const media_query = {
                        text: 'INSERT INTO child_media (child_account_id, type, media, date, description) VALUES ($1, $2, $3, $4, $5)',
                        values: [id_c+1, media[i].type, media[i].media, media[i].date, media[i].description],
                    };
                    pool.query(media_query).then((ans) => {

                    });
                }
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: "Child added successfully", id: id_c+1}));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: 'Server error'}));
            });
    });
}