import * as http from "http";
import path, { dirname } from "path";
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';

import { handleSignUp } from './controllers/signUpHandler.js';
import { handleAddChild } from './controllers/addChildHandler.js';
import { handleAddChildToParent } from './controllers/addChildToParentHandler.js';
import { handleLogin } from './controllers/loginHandler.js';
import { handleDeleteChild } from './controllers/deleteChildHandler.js';
import {handleLogout} from "./controllers/logoutHandler.js";

import req_url from 'url';
import * as fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

let serve = serveStatic(path.join(__dirname, 'public'), {
    index: ['/views/login.html'],
});

const server = http.createServer((req, res) => {
    const parsedUrl = req_url.parse(req.url, true);
    const { pathname } = parsedUrl;
    serve(req, res, () => {
        // res.statusCode = 404;
        // res.setHeader('Content-Type', 'text/html');
        // res.end(fs.readFileSync(path.join(__dirname, 'public/views', 'errorPage.html'), 'utf8'));
        // return;
    });

    const url = req.url;
    if (url.match(/main/) || url.match(/editProfile/)) {
        if (req.headers.cookie && req.headers.cookie.includes("loggedIn=true")) {

        } else {
            //if not logged in
            res.statusCode = 302;
            res.setHeader("Location", "/views/login.html");
            res.end();
            return;
        }
    }

    if (req.method === 'POST' && pathname === '/signup') {
        handleSignUp(req, res);
    }

    if (req.method === 'POST' && pathname === '/addchild') {
        handleAddChild(req, res);
    }

    if (req.method === 'DELETE' && pathname === '/deletechild') {
        handleDeleteChild(req, res);
    }

    if (req.method === 'POST' && pathname === '/addchildtoparent') {
        handleAddChildToParent(req, res);
    }

    if (req.method === 'POST' && pathname === '/login') {
        handleLogin(req, res);
    }
    if (req.method === 'POST' && pathname === '/logout') {
        handleLogout(req,res);
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('SIGINT', function () {
    server.close();
    process.exit();
});