import pool from "../database.js";
import {decryptId} from "./cookieDecrypt.js";

export function handleDeleteChild(req,res){
    let idUser = decryptId(req,res);
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const obj = JSON.parse(body);
        const { code } = obj;
        console.log("sterg copilu: " + code + "cu parintele :" + idUser);
        const query = {
            text: 'DELETE from users_child_accounts where account_id=$1 and user_id=$2',
            values: [code, idUser],
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
