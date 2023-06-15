import "dotenv/config" ;
import * as http from "http";
import path, { dirname } from "path";
import serveStatic from "serve-static";
import { fileURLToPath } from "url";

import { handleSignUp } from "./controllers/signUpHandler.js";
import { retrieveChildData } from "./controllers/childDataRetriever.js";
import { handleAddChild } from "./controllers/addChildHandler.js";
import { handleAddChildToParent } from "./controllers/addChildToParentHandler.js";
import { handleLogin } from "./controllers/loginHandler.js";
import { handleDeleteChild } from "./controllers/deleteChildHandler.js";
import { handleLogout } from "./controllers/logoutHandler.js";
import { retrieveUserData } from "./controllers/editProfileDataRetriever.js";
import { decryptLogin } from "./controllers/cookieDecrypt.js";

import mealTimeController from "./controllers/mealController.js";
import napTimeController from "./controllers/napControler.js";
import {
  updateUserEmail,
  updateUserName,
  updateUserPassword,
  updatePicture
} from "./controllers/updateProfileHandler.js";

import req_url from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

let serve = serveStatic(path.join(__dirname, "public"), {
  index: ["/views/login.html"],
});

const server = http.createServer((req, res) => {
  const parsedUrl = req_url.parse(req.url, true);
  const url = req.url;
  const { pathname } = parsedUrl;
  // 404 nu merge
  // if (url.match(/\/css\/.*/) || url.match(/\/scripts\/.*/)
  //     ||  url.match(/\/views\/.*/)
  // ||  url.match(/\/views\/editProfile.html/)
  // ||  url.match(/\/views\/login.html/)
  // ||  url.match(/\/views\/main.html/)
  // ||  url.match(/\/views\/signUp.html/)
  // || url.match(/\/images\/.*/)
  // ||  url.match(/\/documentation\/.*/)
  // ||  url === '/'){
  serve(req, res, () => {});
  // }
  // else{
  //     res.statusCode = 404;
  //     res.setHeader('Content-Type', 'text/html');
  //     res.end(fs.readFileSync(path.join(__dirname, 'public/views', 'errorPage.html'), 'utf8'));
  //     return;
  // }
  if (url.match(/main/) || url.match(/editProfile/)) {
    decryptLogin(req, res);
  }

  if (req.method === "POST" && pathname === "/signup") {
    handleSignUp(req, res);
  }

  if (req.method === "POST" && pathname === "/addchild") {
    handleAddChild(req, res);
  }

  // if (req.method === 'DELETE' && pathname === '/deletechild') {
  //handleDeleteChild(req, res);
  //}

  if (req.method === "POST" && pathname === "/addchildtoparent") {
    handleAddChildToParent(req, res);
  }

  if (req.method === "POST" && pathname === "/login") {
    handleLogin(req, res);
  }
  if (req.method === "POST" && pathname === "/logout") {
    handleLogout(req, res);
  }
  if (req.method === "GET" && pathname === "/editProfile") {
    retrieveUserData(req, res);
  }
  if (req.method === "GET" && pathname === "/retrieveUserData") {
    retrieveUserData(req, res);
  }
  if (req.method === "POST" && pathname === "/retrieveChildData") {
    retrieveChildData(req, res);
  }
  if (req.method === "POST" && pathname === "/updateName") {
    updateUserName(req, res);
  }
  if (req.method === "POST" && pathname === "/updateEmail") {
    updateUserEmail(req, res);
  }
  if (req.method === "POST" && pathname === "/updatePassword") {
    updateUserPassword(req, res);
  }
  if (req.method === "POST" && pathname === "/addChild") {
    handleAddChildToParent(req, res);
  }
  if (req.method === "POST" && pathname === "/removeChild") {
    handleDeleteChild(req, res);
  }
  if (req.method === 'POST' && pathname === '/updatePicture') {
    updatePicture(req, res);
  }
  if (pathname.startsWith("/meal")) {
    mealTimeController(req, res);
  }
  if (pathname.startsWith("/nap")) {
    napTimeController(req, res);
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGINT", function () {
  server.close();
  process.exit();
});