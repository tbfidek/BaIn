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
import {updateBabyPicture, updateChild} from "./controllers/editChildData.js";
import mealTimeController from "./controllers/mealController.js";
import napTimeController from "./controllers/napControler.js";
import { getRSS } from "./controllers/rssController.js";
import {
  updateUserEmail,
  updateUserName,
  updateUserPassword,
  updatePicture
} from "./controllers/updateProfileHandler.js";

import req_url from "url";
import {addMedia} from "./controllers/galleryHandler.js";
import {retrieveChildGallery} from "./controllers/retrieveChildGallery.js";
import {addMedicalFile} from "./controllers/addMedicalFile.js";
import { retrieveExportData } from "./controllers/retrieveExportData.js";
import {handleImportChild} from "./controllers/importChildData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

let serve = serveStatic(path.join(__dirname, "public"), {
  index: ["/views/login.html"],
});

const server = http.createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  const parsedUrl = req_url.parse(req.url, true);
  const url = req.url;
  const { pathname } = parsedUrl;

  serve(req, res, () => {});

  if (url.match(/main/) || url.match(/editProfile/)) {
    decryptLogin(req, res);
  }

  if (req.method === "POST" && pathname === "/signup") {
    handleSignUp(req, res);
  }

  if (req.method === "POST" && pathname === "/addchild") {
    handleAddChild(req, res);
  }

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
  if (req.method === "POST" && pathname === "/populateGallery") {
    retrieveChildGallery(req, res);
  }
  if (req.method === "POST" && pathname === "/populateTimeline") {
    retrieveChildGallery(req, res);
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
  if (req.method === 'POST' && pathname === '/updateBabyPicture') {
    updateBabyPicture(req, res);
  }
  if (req.method === 'POST' && pathname === '/editChildData') {
    updateChild(req, res);
  }
  if (req.method === 'POST' && pathname === '/addMedia') {
    addMedia(req, res);
  }
  if (req.method === 'POST' && pathname === '/addMedicalFile') {
    addMedicalFile(req, res);
  }
  if (req.method === 'GET' && pathname === '/retrieveExportData') {
    retrieveExportData(req, res);
  }
  if (req.method === 'POST' && pathname === '/importChildData') {
    handleImportChild(req, res);
  }
  if (pathname === "/rss" && req.method === "GET") {
    getRSS(req, res);
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