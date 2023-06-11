import pool from "../database.js";

export function handleAddChildToParent(req,res){
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const obj = JSON.parse(body);
        const { child_id, parent_id } = obj;

        console.log(obj);
        const query = {
            text: 'INSERT INTO users_child_accounts (user_id, account_id) VALUES ($1, $2)',
            values: [parent_id, child_id],
        };
        pool.query(query)
            .then(() => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: "Relation added successfully"}));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Server error' }));
            });
    });
}
