import pkg from "pg";
import database from "../config.js";
const { Pool } = pkg;
const pool = new Pool(database);
import { getFile } from "../services/s3client.js";

export function handleGetFilesByDate(req, res) {
  const params = req.url.split("/");
  const childId = params[2];
  const date = params[3];

  const query = {
    text: "SELECT * FROM child_medical WHERE child_account_id = $1 AND date = $2",
    values: [childId, date],
  };

  pool
    .query(query)
    .then(async (result) => {
      if (result.rowCount > 0) {
        let files = await Promise.all(
          result.rows.map(async (row, index) => {
            return {
              filename: `file${index + 1}.pdf`,
              url: await getFile(row.file),
            };
          })
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(files));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: `No files found for date ${date}.` })
        );
      }
    })
    .catch((error) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "An error occurred while fetching the files.",
        })
      );
    });
}