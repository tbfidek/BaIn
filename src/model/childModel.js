import pool from "../database.js";
import {getFile} from "../services/s3client.js";

export async function addChild (child) {

    let id_c = -1;
    const query2 = {
        text: 'SELECT MAX(account_id) from child_accounts',
    };
    id_c =  await pool.query(query2).then((ans) => {
        if (ans.rows[0].max === null) {
            return 0;
        } else {
            return ans.rows[0].max;
        }
    });

    const result = await pool.query(
        'INSERT INTO child_accounts (name, birthday, weight, height, gender,profile_image) VALUES ($1, $2, $3, $4, $5,$6)',
        [child.name, child.birthday, child.weight, child.height, child.gender, child.img]
    ).then(results => {
        return {message: "Child added successfully", id: id_c + 1};
    }).catch(error => {
        return {message: "Server Error"};
    });
    return result;
}

export async function updateChild(child) {

    const result = await pool.query(
        'UPDATE child_accounts SET name = $1, birthday = $2, weight = $3, height = $4, gender = $5, profile_image = $6 WHERE account_id = $7',
        [child.new_name, child.new_birthday, child.new_weight, child.new_height, child.new_gender, child.new_profile_image, child.child_id]
    ).then(results => {
        return {message: "Child data updated successfully"};
    }).catch(error => {
        return {message: "Server Error"};
    });
    return result;
}

export async function importChild(child) {
    let id_c = -1;
    const query2 = {
        text: 'SELECT COALESCE (MAX(account_id), 0) FROM child_accounts',
    };
    await pool.query(query2).then((ans) => {
        id_c = ans.rows[0].coalesce;
    });

    const result = await pool.query('INSERT INTO child_accounts (name, birthday, weight, height, gender, profile_image) VALUES ($1, $2, $3, $4, $5, $6)',
        [child.name, child.birthday, child.weight, child.height, child.gender, child.photo])
        .then(() => {
            //user_id | child_account_id | meal_date  | meal_description | meal_type | meal_option
            if(child.meal_records != null){
                for(let i = 0; i < child.meal_records.length; ++i){
                    const meal_query = {
                        text: 'INSERT INTO meal_records (user_id, child_account_id, meal_date, meal_description, meal_type, meal_option) VALUES ($1, $2, $3, $4, $5, $6)',
                        values: [child.parent_id, id_c+1, child.meal_records[i].meal_date, child.meal_records[i].meal_description, child.meal_records[i].meal_type, child.meal_records[i].meal_option],
                    };
                    pool.query(meal_query).then((ans) => {

                    });
                }
            }
            if(child.nap_records != null){
                for(let i = 0; i < child.nap_records.length; ++i){
                    const nap_query = {
                        text: 'INSERT INTO nap_records (user_id, child_account_id, nap_date, start_time, end_time, sleep_quality) VALUES ($1, $2, $3, $4, $5,$6)',
                        values: [child.parent_id, id_c+1, child.nap_records[i].nap_date, child.nap_records[i].start_time, child.nap_records[i].end_time, child.nap_records[i].sleep_quality],
                    };
                    pool.query(nap_query).then((ans) => {

                    });
                }
            }
            if(child.media != null){
                for(let i = 0; i < child.media.length; ++i){
                    const media_query = {
                        text: 'INSERT INTO child_media (child_account_id, type, media, date, description) VALUES ($1, $2, $3, $4, $5)',
                        values: [id_c+1, child.media[i].type, child.media[i].media, child.media[i].date, child.media[i].description],
                    };
                    pool.query(media_query).then((ans) => {

                    });
                }
            }
            return {message: "Child data imported successfully.", id: id_c+1};
        })
        .catch((err) => {
            return {message: "Server Error."};
        });

    return result;
}


export async function exportChild(user_id) {

    const result = await pool.query("SELECT * FROM child_accounts WHERE account_id IN ( SELECT account_id FROM users_child_accounts WHERE user_id = $1)",
        [user_id])
        .then(async (childResult) => {
            if (childResult.rows.length === 0) {
                return {message: "Child not found"};
            }
            const child = childResult.rows;
            const jsonContent = [];
            let csvContent = 'Child_Name,Birthday,Weight,Height,Gender,Profile_Image\n';
            for(let i = 0; i < child.length; ++i){
                csvContent += `${child[i].name},${child[i].birthday},${child[i].weight},${child[i].height},${child[i].gender},${child[i].profile_image}\n`;
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
                jsonContent.push(childData);
            }
            return {json: jsonContent, csv: csvContent};
        })
        .catch((err) => {
            return {message: "Server error"};
        });
    return result;
}

export async function deleteChildConnection(parent_id, child_id){

    const query = {
        text: 'DELETE from users_child_accounts where account_id=$1 and user_id=$2',
        values: [child_id, parent_id],
    };
    const result = pool.query(query)
        .then(() => {
            return { message: "Child deleted successfully"};
        })
        .catch((err) => {
            return { message: 'Server error' };
        });
    await new Promise(r => setTimeout(r, 1000));
    let max_id = 1;
    const query2 = {
        text: 'SELECT MAX(account_id) from child_accounts',
    };
    pool.query(query2).then((ans) => {
        if(ans.rows[0].max === null){
            max_id = 1;
        } else {
            max_id = ans.rows[0].max;
            console.log("testee: " + ans.rows[0].max);
        }
    });
    await new Promise(r => setTimeout(r, 500));
    console.log("max id este: " + (max_id));
    const query3 = {
        text: `ALTER SEQUENCE child_accounts_account_id_seq RESTART WITH ${max_id+1}`,
    };
    pool.query(query3).then((ans) => {
        //id_p = ans.rows[0].max;
    });
    return result;
}

export async function addChildConnection(parent_id, child_id){

    const checkQuery = {
        text: 'SELECT * FROM users_child_accounts WHERE user_id = $1 AND account_id = $2',
        values: [parent_id, child_id],
    };
    const result = await pool.query(checkQuery)
        .then(async (result) => {
            if (result.rows.length > 0) {
                return { message: "Child is already added to the parent" };
            } else {
                const insertQuery = {
                    text: 'INSERT INTO users_child_accounts (user_id, account_id) VALUES ($1, $2)',
                    values: [parent_id, child_id],
                };
                let insertResult = await pool.query(insertQuery)
                    .then(() => {
                        return { message: "Relation added successfully" };
                    })
                    .catch((err) => {
                        return { message: 'Server error' };
                    });
                return insertResult;
            }
        })
        .catch((err) => {
            return { message: 'Server error' };
        });
    return result;
}

export async function retrieveChildDataModel(user_id, child_id) {
    const childQuery = {
        text: "SELECT c.* FROM child_accounts c JOIN users_child_accounts u ON u.user_id = $1 WHERE c.account_id = $2",
        values: [user_id, child_id],
    };

    try {
        const [childResult] = await Promise.all([pool.query(childQuery)]);

        if (childResult.rows.length === 0) {
            return null;
        }

        const child = childResult.rows[0];
        const url = await getFile(child.profile_image);

        const childData = {
            id: child.account_id,
            name: child.name,
            birthday: child.birthday,
            weight: child.weight,
            height: child.height,
            gender: child.gender,
            image: url,
            image_code: child.profile_image,
        };

        return childData;
    } catch (err) {
        console.error(err);
        throw new Error("Database error");
    }
}
