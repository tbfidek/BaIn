import "dotenv/config";
import * as http from "http";
import path, { dirname } from "path";
import serveStatic from "serve-static";
import { fileURLToPath } from "url";
import {
  retrieveUserData,
  updatePicture,
  updateUserEmail,
  updateUserName,
  updateUserPassword
} from "./controllers/userController.js";
import { decryptLogin, getLoggedStatus } from "./controllers/cookieDecrypt.js";
import mealTimeController from "./controllers/mealController.js";
import napTimeController from "./controllers/napControler.js";
import { getRSS } from "./controllers/rssController.js";
import { handleGetFilesByDate } from "./model/fileGetter.js";
import * as childController from "./controllers/childController.js";
import * as authController from "./controllers/authController.js";
import req_url from "url";
import {addMedia, addMedicalFile, retrieveChildGallery} from "./controllers/filesController.js";
import {retrieveChildData} from "./controllers/childController.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;

let serve = serveStatic(path.join(__dirname, "public"), {
  index: ["/views/login.html"],
});


const server = http.createServer((req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  const parsedUrl = req_url.parse(req.url, true);
  const url = req.url;
  const { pathname } = parsedUrl;

  serve(req, res, () => {});

  if( url.match(/login.html/) || url.match(/signUp.html/) || url.match(/signup.html/)){
    getLoggedStatus(req, res);
  }
  if (url.match(/main/) || url.match(/editProfile/)) {
    decryptLogin(req, res);
  }

  if (req.method === "POST" && pathname === "/signup") {
    authController.handleSignUp(req, res);
  }

  if (req.method === "POST" && pathname === "/addchild") {
    childController.handleAddChild(req, res);
  }

  if (req.method === "POST" && pathname === "/addchildtoparent") {
    childController.handleAddChildToParent(req, res);
  }

  if (req.method === "POST" && pathname === "/login") {
    authController.handleLogin(req, res);

  }
  if (req.method === "POST" && pathname === "/logout") {
    authController.handleLogout(req, res);
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
    childController.handleAddChildToParent(req, res);
  }
  if (req.method === "POST" && pathname === "/removeChild") {
    childController.handleDeleteChild(req, res);
  }
  if (req.method === "POST" && pathname === "/updatePicture") {
    updatePicture(req, res);
  }
  if (req.method === "POST" && pathname === "/updateBabyPicture") {
    childController.updateBabyPicture(req, res);
  }
  if (req.method === "POST" && pathname === "/editChildData") {
    childController.handleUpdateChild(req, res);
  }
  if (req.method === "POST" && pathname === "/addMedia") {
    addMedia(req, res);
  }
  if (req.method === "POST" && pathname === "/addMedicalFile") {
    addMedicalFile(req, res);
  }
  if (req.method === "GET" && pathname === "/retrieveExportData") {
    childController.retrieveExportData(req, res);
  }
  if (req.method === "POST" && pathname === "/importChildData") {
    childController.handleImportChild(req, res);
  }
  if (pathname === "/rss" && req.method === "GET") {
    getRSS(req, res);
  }
  if (pathname.startsWith("/getFilesByDate") && req.method === "GET") {
    handleGetFilesByDate(req, res);
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
