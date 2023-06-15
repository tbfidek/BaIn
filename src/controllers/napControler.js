import catchAsync from "../catchAsync.js";
import parseRequestBody from "../parseReq.js";
import {
  getAllNaps,
  insertNap,
  getAllNapsMonth,
  getAllNapsByChild,
  deleteMealByChild,
} from "../model/napModel.js";
import AppError from "./appError.js";
import errorController from "./errorController.js";
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

const getAll = catchAsync(async (req, res) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  let response = await getAllNaps(userId);
  res.statusCode = 201;
  res.end(JSON.stringify(response));
});

const getAllByChild = catchAsync(async (req, res, childId) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  let response = await getAllNapsByChild(userId, childId);
  res.statusCode = 200;
  res.end(JSON.stringify(response));
});

const deleteByChild = catchAsync(async (req, res, napId) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  let deleteCount = await deleteMealByChild(userId, napId);
  if (deleteCount === 0) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Meal not found" }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ message: "Meal deleted successfully" }));
});

const insertNaps = catchAsync(async (req, res) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  const napTime = await parseRequestBody(req);

  if (
    !napTime ||
    !userId ||
    !napTime.child_account_id ||
    !napTime.nap_date ||
    !napTime.start_time ||
    !napTime.end_time ||
    !napTime.sleep_quality
  ) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: "Data is invalid!" }));
    return;
  }

  try {
    const response = await insertNap(napTime, userId);
    res.statusCode = 201;
    res.end(JSON.stringify(response));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        message: "There was an error when inserting data into database!",
      })
    );
  }
});

const getAllNapsByMonth = catchAsync(async (req, res) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  const parts = req.url.split("/");
  const childId = parts[2];
  const [year, month] = parts[4].split("-");
  console.log(year, month);
  const result = await getAllNapsMonth(userId, childId, year, month);
  if (!result.length) {
    return errorController(
      res,
      new AppError("No nap time found with in the required month", 404)
    );
  }
  res.statusCode = 200;
  res.end(JSON.stringify(result));
});

const napTimeController = catchAsync(async (req, res) => {
  const { method, url } = req;
  res.setHeader("Content-Type", "application/json");
  if (url.match(/\/nap\/(\d+)\/month\/(\d{4}-\d{2})/) && method === "GET") {
    getAllNapsByMonth(req, res);
  } else if (url.match(/\/nap\/(\d+)/) && method === "GET") {
    let childId = url.split("/")[2];
    getAllByChild(req, res, childId);
  } else if (url === "/nap" && method === "GET") {
    getAll(req, res);
  } else if (url.match(/\/nap\/(\d+)/) && method === "DELETE") {
    let napId = url.split("/")[2];
    deleteByChild(req, res, napId);
  } else if (url === "/nap" && method === "POST") {
    insertNaps(req, res);
  }
});
export default napTimeController;
