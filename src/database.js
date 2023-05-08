import pkg from 'pg';
const { Pool } = pkg;
import database from './config.js';

const pool = new Pool(database);

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Connected!');

    const sql = 'SELECT * FROM users';
    client.query(sql, (err, result) => {
        release();
        if (err) {
            console.error('Error executing query', err.stack);
            return;
        }
        console.log('Result:', result.rows);

        pool.end();
        console.log('Pool closed!');
    });
});
