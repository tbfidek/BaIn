import pkg from "pg";
import database from "../src/config.js";
const { Pool } = pkg;
const pool = new Pool(database);

const getAllNaps = async () => {
  const result = await pool.query(
    "SELECT user_id,TO_CHAR(nap_date, 'YYYY-MM-DD') AS nap_date, start_time, end_time, sleep_quality FROM nap_records"
  );
  console.log(result.rows);
  return result.rows;
};

const getAllNapsMonth = async (userId, year, month) => {
  const formattedDate = `${year}-${month}`;
  const query = {
    text: "SELECT * FROM nap_records WHERE user_id = $1 AND TO_CHAR(nap_date, 'yyyy-MM') = $2 || '-' || $3",
    values: [userId, year, month],
  };
  const result = await pool.query(query);
  const naps = [];
  for (let i = 0; i < result.rows.length; i++) {
    naps.push({
      user_id: result.rows[i].user_id,
      nap_date: result.rows[i].nap_date,
      start_time: result.rows[i].start_time,
      end_time: result.rows[i].end_time,
      sleep_quality: result.rows[i].sleep_quality,
    });
  }
  return naps;
};

const insertNap = async (napData) => {
  try {
    const query = {
      text: "INSERT INTO nap_records(user_id,nap_date, start_time, end_time, sleep_quality) VALUES($1, $2, $3, $4,$5) RETURNING *",
      values: [
        napData.user_id,
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
export { getAllNaps, insertNap, getAllNapsMonth };
