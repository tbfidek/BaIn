import pkg from "pg";
import database from "../config.js";
const { Pool } = pkg;
const pool = new Pool(database);

const getAllNaps = async (userId) => {
  const result = await pool.query(
    "SELECT id,user_id,TO_CHAR(nap_date, 'YYYY-MM-DD') AS nap_date, start_time, end_time, sleep_quality FROM nap_records ORDER BY nap_date DESC",
    [userId]
  );
  return result.rows;
};

const getAllNapsByChild = async (userId, childId) => {
  const result = await pool.query(
    "SELECT id,user_id,TO_CHAR(nap_date, 'YYYY-MM-DD') AS nap_date, start_time, end_time, sleep_quality FROM nap_records WHERE user_id = $1 AND child_account_id=$2 ORDER BY nap_date DESC",
    [userId, childId]
  );
  return result.rows;
};
const deleteMealByChild = async (userId, napId) => {
  const query = {
    text: "DELETE FROM nap_records WHERE user_id = $1 AND id=$2",
    values: [userId, napId],
  };
  try {
    const result = await pool.query(query);
    return result.rowCount;
  } catch (error) {
    console.error("Unable to execute query:", error.stack);
    throw error;
  }
};
const getAllNapsMonth = async (userId, childId, year, month) => {
  const query = {
    text: "SELECT id, user_id, child_account_id, TO_CHAR(nap_date, 'YYYY-MM-DD') AS nap_date, start_time, end_time, sleep_quality FROM nap_records WHERE user_id = $1 AND child_account_id= $2 AND TO_CHAR(nap_date, 'yyyy-MM') = $3 || '-' || $4 ORDER BY nap_date DESC",
    values: [userId, childId, year, month],
  };

  const result = await pool.query(query);
  const naps = [];
  for (let i = 0; i < result.rows.length; i++) {
    naps.push({
      id: result.rows[i].id,
      user_id: result.rows[i].user_id,
      nap_date: result.rows[i].nap_date,
      start_time: result.rows[i].start_time,
      end_time: result.rows[i].end_time,
      sleep_quality: result.rows[i].sleep_quality,
    });
  }
  return naps;
};

const insertNap = async (napData, userId) => {
  try {
    const query = {
      text: "INSERT INTO nap_records(user_id,child_account_id,nap_date, start_time, end_time, sleep_quality) VALUES($1, $2, $3, $4,$5,$6) RETURNING *",
      values: [
        userId,
        napData.child_account_id,
        napData.nap_date,
        napData.start_time,
        napData.end_time,
        napData.sleep_quality,
      ],
    };

    const result = await pool.query(query);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export {
  getAllNaps,
  insertNap,
  getAllNapsMonth,
  getAllNapsByChild,
  deleteMealByChild,
};
