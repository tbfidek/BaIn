import RSS from "rss";
import pkg from "pg";
import database from "../config.js";
const { Pool } = pkg;
const pool = new Pool(database);
import { getFile } from "../services/s3client.js";

async function generateRSS(user_id) {
  const childrenQuery = {
    text: "SELECT account_id FROM users_child_accounts WHERE user_id = $1",
    values: [user_id],
  };

  const childrenResult = await pool.query(childrenQuery);
  const feed = new RSS({
    title: "Children Timeline RSS Feed",
    description: "RSS feed of all the children's timeline",
    feed_url: `http://localhost:3000/rss?user_id=${user_id}`,
    site_url: "http://localhost:3000",
    language: "en",
  });

  for (const child of childrenResult.rows) {
    const child_id = child.account_id;
    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-based
    const day = today.getDate();

    const childQuery = {
      text: `
    SELECT * FROM child_media 
    WHERE child_account_id = $1 
      AND EXTRACT(MONTH FROM date) = $2 
      AND EXTRACT(DAY FROM date) = $3
  `,
      values: [child_id, month, day],
    };

    const nameQuery = {
      text: "SELECT name FROM child_accounts WHERE account_id = $1",
      values: [child_id],
    };
    const nameResult = await pool.query(nameQuery);
    const childName = nameResult.rows[0].name;
    console.log(childName);
    const childResult = await pool.query(childQuery);

    for (const row of childResult.rows) {
      const url = await getFile(row.media);
      feed.item({
        title: `${childName} (Child ID: ${child_id})`,
        description: row.description,
        url,
        date: row.date,
        enclosure: {
          url,
          type: row.type === "video" ? "video/mp4" : "image/jpeg",
        },
      });
    }
  }

  return feed.xml({ indent: true });
}

export { generateRSS };