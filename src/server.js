import pool from "./database.js";
import crypto from "crypto";
import { parse } from "querystring";
import * as http from "http";
import path, {dirname} from "path";
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';

import req_url from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

let serve = serveStatic(path.join(__dirname, 'public'), {
    index: ['/views/login.html'],
});

const server = http.createServer((req, res) => {
    const parsedUrl = req_url.parse(req.url, true);
    const { pathname } = parsedUrl;
    serve(req, res, () => {
    });

    const url = req.url;
    if(url.match(/main/)){

    }
    if (req.method === 'POST' && pathname === '/signup') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const obj = JSON.parse(body);
            const { username, email, pw } = obj;
            const salt = crypto.randomBytes(16).toString('hex');
            const hashedPassword = crypto
                .createHash('sha256')
                .update(pw + salt)
                .digest('hex');
            let id_p = -1;
            const query2 = {
                text: 'SELECT MAX(user_id) from users',
            };
            pool.query(query2).then((ans) => {
                id_p = ans.rows[0].max;
            });
            const query = {
                text: 'INSERT INTO users (name, email, password, salt) VALUES ($1, $2, $3, $4)',
                values: [username, email, hashedPassword, salt],
            };
            pool.query(query)
                .then(() => {
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'User created successfully', id: id_p + 1 }));
                })
                .catch((err) => {
                    console.error(err);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Server error' }));
                });
        });
    }

    if (req.method === 'POST' && pathname === '/addchild') {
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

    if (req.method === 'DELETE' && pathname === '/deletechild') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const obj = JSON.parse(body);
            const { child_id } = obj;
            const query = {
                text: 'DELETE from child_accounts where account_id=$1',
                values: [child_id],
            };
            pool.query(query)
                .then(() => {
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: "Child deleted successfully"}));
                })
                .catch((err) => {
                    console.error(err);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Server error' }));
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
        });
    }

    if (req.method === 'POST' && pathname === '/addchildtoparent') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const obj = JSON.parse(body);
            const { child_id, parent_id } = obj;

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

});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('SIGINT', function () {
    // db.close();
    server.close();
    process.exit();
});