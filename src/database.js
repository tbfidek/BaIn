import pkg from 'pg';
const { Pool } = pkg;
import database from './config.js';
const pool = new Pool(database);
pkg.types.setTypeParser(1114, function (value) {
    return value
})

pkg.types.setTypeParser(1082, function(value) {
    return value;
});
pool.connect((err, client, release) => {
    if (err) throw err;
    console.log('Connected!');


    pool.on('close', () => {
        console.log('Connection closed!');
        release(); // Release the client
    });
});
export default pool;