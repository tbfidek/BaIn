import * as http from "http";
import path, {dirname} from "path";
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';

import { handleSignUp } from './controllers/signUpHandler.js';
import { handleAddChild } from './controllers/addChildHandler.js';
import { handleAddChildToParent } from './controllers/addChildToParentHandler.js';
import { handleLogin } from './controllers/loginHandler.js';
import { handleDeleteChild } from './controllers/deleteChildHandler.js';

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
        handleSignUp(req,res);
    }

    if (req.method === 'POST' && pathname === '/addchild') {
        handleAddChild(req,res);
    }

    if (req.method === 'DELETE' && pathname === '/deletechild') {
        handleDeleteChild(req,res);
    }

    if (req.method === 'POST' && pathname === '/addchildtoparent') {
        handleAddChildToParent(req,res);
    }

    if (req.method === 'POST' && pathname === '/login') {
        handleLogin(req,res);
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
