import catchAsync from "../catchAsync.js";
import parseRequestBody from "../parseReq.js";
import jwt from "jsonwebtoken";

import {
  getAllMeals,
  insertMeal,
  getAllMealsMonth,
  getAllMealsByChild,
  deleteMealByChild,
} from "../model/mealModel.js";
import AppError from "./appError.js";
import errorController from "./errorController.js";

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
  let response = await getAllMeals(userId);
  res.statusCode = 200;
  res.end(JSON.stringify(response));
});
const getAllByChild = catchAsync(async (req, res, childId) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  let response = await getAllMealsByChild(userId, childId);
  res.statusCode = 200;
  res.end(JSON.stringify(response));
});

const deleteByChild = catchAsync(async (req, res, mealId) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  let deleteCount = await deleteMealByChild(userId, mealId);
  if (deleteCount === 0) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Meal not found" }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ message: "Meal deleted successfully" }));
});

const insertMeals = catchAsync(async (req, res) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }

  const mealTime = await parseRequestBody(req);

  if (
    !mealTime ||
    !userId ||
    !mealTime.child_account_id ||
    !mealTime.meal_date ||
    !mealTime.meal_description ||
    !mealTime.meal_type ||
    !mealTime.meal_option
  ) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: "Data is invalid!" }));
    return;
  }

  try {
    const response = await insertMeal(mealTime, userId);
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

const getAllMealsByMonth = catchAsync(async (req, res) => {
  let userId = await decryptId(req, res);
  if (userId == null) {
    console.error("Invalid or missing token");
    throw new Error("Invalid or missing token");
  }
  const parts = req.url.split("/");
  const childId = parts[2];
  const [year, month] = parts[4].split("-");
  const result = await getAllMealsMonth(userId, childId, year, month);
  if (!result.length) {
    return errorController(
      res,
      new AppError("No meal time found with in the required month", 404)
    );
  }
  res.statusCode = 200;
  res.end(JSON.stringify(result));
});

const mealTimeController = catchAsync(async (req, res) => {
  const { method, url } = req;
  res.setHeader("Content-Type", "application/json");
  if (url.match(/\/meal\/(\d+)\/month\/(\d{4}-\d{2})/) && method === "GET") {
    getAllMealsByMonth(req, res);
  } else if (url.match(/\/meal\/(\d+)/) && method === "GET") {
    let childId = url.split("/")[2];
    getAllByChild(req, res, childId);
  } else if (url === "/meal" && method === "GET") {
    getAll(req, res);
  } else if (url.match(/\/meal\/(\d+)/) && method === "DELETE") {
    let mealId = url.split("/")[2];
    deleteByChild(req, res, mealId);
  } else if (url === "/meal" && method === "POST") {
    insertMeals(req, res);
  }
});
export default mealTimeController;
