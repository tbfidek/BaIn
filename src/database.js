import pkg from 'pg';
const { Pool } = pkg;
import database from './config.js';

const pool = new Pool(database);

pool.connect((err, client, release) => {
    if (err) throw err;
    console.log('Connected!');

    // Do some database operations here...

    release();
    console.log('Connection released!');
});
