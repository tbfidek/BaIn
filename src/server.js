import * as http from "http";
import path, {dirname} from "path";
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

let serve = serveStatic(path.join(__dirname, 'public'), {
    index: ['/views/login.html'],
});

const server = http.createServer((req, res) => {
    serve(req, res, () => {
    });
    const url = req.url;
    if(url.match(/main/)){

    }
});

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});

process.on('SIGINT', function () {
    // db.close();
    server.close();
    process.exit();
});