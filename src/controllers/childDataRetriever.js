import pool from "../database.js";

export function retrieveChildData(req, res) {

    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const obj = JSON.parse(body);
        const { user_id, child_name} = obj;
        const childQuery = {
            text: "SELECT * FROM child_accounts c JOIN users_child_accounts u ON u.user_id = $1 WHERE c.name = $2",
            values: [user_id, child_name],
        };

        Promise.all([pool.query(childQuery)])
            .then(([childResult]) => {
                if (childResult.rows.length === 0) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: "Child not found" }));
                    return;
                }
                const child = childResult.rows[0];
                const childData = {
                    id: child.id,
                    name: child.name,
                    birthday: child.birthday,
                    weight: child.weight,
                    height: child.height,
                    gender: child.gender
                };

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(childData));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Server error" }));
                return;
            });
    });
}