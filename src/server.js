import * as http from "http";
import path, {dirname} from "path";
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';

// import pkg from 'pg';
// const { Pool } = pkg;
// import database from './config.js';
//
// const pool = new Pool(database);

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

let serve = serveStatic(path.join(__dirname, 'public'), {
    index: ['/views/login.html'],
});

const server = http.createServer((req, res) => {
    serve(req, res, () => {
    });
    // pool.connect((err, client, release) => {
    //     if (err) throw err;
    //     console.log('Connected!');
    //
    //     // Do some database operations here...
    //
    //     release();
    //     console.log('Connection released!');
    // });
    const url = req.url;
    if(url.match(/main/)){
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