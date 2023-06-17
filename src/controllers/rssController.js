import url from "url";
import { generateRSS } from "../model/rssGenerator.js"; //
import jwt from "jsonwebtoken";

async function decryptId(req, res) {
  const cookie = req.headers.cookie;
  let id;
  const token = cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("idToken="))
    .split("=")[1];
  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Invalid token" }));
      return;
    }
    id = decoded.userId;
  });
  return id;
}
export const getRSS = async (req, res) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  try {
    const rss = await generateRSS(userId);
    res.setHeader("Content-Type", "application/rss+xml");
    res.end(rss);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Server error" }));
    console.error(err);
  }
};