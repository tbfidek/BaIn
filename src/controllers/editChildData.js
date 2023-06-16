import pool from "../database.js";

export function updateChild(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {
            child_id,
            new_name,
            new_birthday,
            new_weight,
            new_height,
            new_gender,
            new_profile_image
        } = JSON.parse(body);
        const query = {
            text: 'UPDATE child_accounts SET name = $1, birthday = $2, weight = $3, height = $4, gender = $5, profile_image = $6 WHERE account_id = $7',
            values: [new_name, new_birthday, new_weight, new_height, new_gender, new_profile_image, child_id],
        };
        pool.query(query)
            .then(() => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: "Child data updated successfully"}));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            });

    });
}