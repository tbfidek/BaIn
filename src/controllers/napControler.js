import catchAsync from "../catchAsync.js";
import parseRequestBody from "../parseReq.js";
import { getAllNaps, insertNap, getAllNapsMonth } from "../model/napModel.js";
import AppError from "./appError.js";
import errorController from "./errorController.js";

const getAll = catchAsync(async (req, res) => {
  let response = await getAllNaps();
  res.statusCode = 201;
  res.end(JSON.stringify(response));
});
const insertNaps = catchAsync(async (req, res) => {
  const napTime = await parseRequestBody(req);

  // Verificarea daca obiectul napTime exista si are toate proprietatile necesare
  if (
    !napTime ||
    !napTime.user_id ||
    !napTime.nap_date ||
    !napTime.start_time ||
    !napTime.end_time ||
    !napTime.sleep_quality
  ) {
    res.statusCode = 400; // Codul de status pentru Bad Request
    res.end(JSON.stringify({ message: "Data is invalid!" }));
    return;
  }

  // Daca totul este in regula, se apeleaza functia pentru a insera datele in baza de date
  try {
    const response = await insertNap(napTime);
    res.statusCode = 201;
    res.end(JSON.stringify(response));
  } catch (err) {
    console.error(err);
    res.statusCode = 500; // Codul de status pentru Internal Server Error
    res.end(
      JSON.stringify({
        message: "There was an error when inserting data into database!",
      })
    );
  }
});

const getAllNapsByMonth = catchAsync(async (req, res) => {
  const parts = req.url.split("/");
  const userId = parts[3];
  const [year, month] = parts[5].split("-");
  const result = await getAllNapsMonth(userId, year, month);
  if (!result.length) {
    errorController(
      res,
      new AppError("No nap time found with in the required month", 404)
    );
    return;
  }
  res.statusCode = 200;
  res.end(JSON.stringify(result));
});

const napTimeController = catchAsync(async (req, res) => {
  const { method, url } = req;
  res.setHeader("Content-Type", "application/json");
  if (url === "/api/nap" && method === "GET") {
    getAll(req, res);
  } else if (
    url.match(/\/api\/nap\/(\d+)\/month\/(\d{4}-\d{2})/) &&
    method === "GET"
  ) {
    console.log("da");
    getAllNapsByMonth(req, res);
  } else if (url === "/api/nap" && method === "POST") {
    insertNaps(req, res);
  }
});
export default napTimeController;
