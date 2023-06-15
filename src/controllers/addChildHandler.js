import pool from "../database.js";

export function handleAddChild(req,res){
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const obj = JSON.parse(body);
        const { name, birthday, width, weight, gender } = obj;
        let id_c = -1;
        const query2 = {
            text: 'SELECT MAX(account_id) from child_accounts',
        };
        pool.query(query2).then((ans) => {
            if(ans.rows[0].max === null){
                id_c = 0;
            } else {
                id_c = ans.rows[0].max;
            }
            //console.log(ans.rows[0].max);
        });
        const query = {
            text: 'INSERT INTO child_accounts (name, birthday, weight, height, gender) VALUES ($1, $2, $3, $4, $5)',
            values: [name, birthday, width, weight, gender],
        };
        pool.query(query)
            .then(() => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: "Child added successfully", id: id_c + 1}));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            });
    });
}