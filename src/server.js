import * as http from "http";
import path, { dirname } from "path";
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';
import * as fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

let serve = serveStatic(path.join(__dirname, 'public'), {
    index: ['/views/login.html'],
});

const server = http.createServer((req, res) => {
    serve(req, res, () => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(fs.readFileSync(path.join(__dirname, 'public/views', 'errorPage.html'), 'utf8'));
    });


    const url = req.url;
    if (url.match(/main/)) {
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('SIGINT', function () {
    server.close();
    process.exit();
});
