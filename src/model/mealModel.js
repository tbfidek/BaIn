import pkg from "pg";
import database from "../config.js";
const { Pool } = pkg;
const pool = new Pool(database);

const getAllMeals = async (userId) => {
  const result = await pool.query(
    "SELECT id,user_id,TO_CHAR(meal_date, 'YYYY-MM-DD') AS meal_date, meal_description, meal_type, meal_option FROM meal_records WHERE user_id = $1 ORDER BY meal_date DESC",
    [userId]
  );
  return result.rows;
};
const getAllMealsByChild = async (userId, childId) => {
  const result = await pool.query(
    "SELECT id,user_id,TO_CHAR(meal_date, 'YYYY-MM-DD') AS meal_date, meal_description, meal_type, meal_option FROM meal_records WHERE user_id = $1 AND child_account_id=$2 ORDER BY meal_date DESC",
    [userId, childId]
  );
  return result.rows;
};
const getAllMealsMonth = async (userId, childId, year, month) => {
  const query = {
    text: "SELECT id, user_id, TO_CHAR(meal_date, 'YYYY-MM-DD') AS meal_date, meal_description, meal_type, meal_option FROM meal_records WHERE user_id = $1 AND child_account_id= $2 AND TO_CHAR(meal_date, 'yyyy-MM') = $3 || '-' || $4 ORDER BY meal_date DESC",
    values: [userId, childId, year, month],
  };

  const result = await pool.query(query);
  const meals = [];
  for (let i = 0; i < result.rows.length; i++) {
    meals.push({
      id: result.rows[i].id,
      user_id: result.rows[i].user_id,
      meal_date: result.rows[i].meal_date,
      meal_description: result.rows[i].meal_description,
      meal_type: result.rows[i].meal_type,
      meal_option: result.rows[i].meal_option,
    });
  }
  console.log(meals);
  return meals;
};
const deleteMealByChild = async (userId, mealId) => {
  const query = {
    text: "DELETE FROM meal_records WHERE user_id = $1 AND id=$2",
    values: [userId, mealId],
  };
  try {
    const result = await pool.query(query);
    return result.rowCount;
  } catch (error) {
    console.error("Unable to execute query:", error.stack);
    throw error;
  }
};

const insertMeal = async (mealData, userId) => {
  try {
    const query = {
      text: "INSERT INTO meal_records(user_id,child_account_id, meal_date, meal_description, meal_type, meal_option) VALUES($1, $2, $3, $4, $5,$6) RETURNING *",
      values: [
        userId,
        mealData.child_account_id,
        mealData.meal_date,
        mealData.meal_description,
        mealData.meal_type,
        mealData.meal_option,
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
  getAllMeals,
  insertMeal,
  getAllMealsMonth,
  getAllMealsByChild,
  deleteMealByChild,
};
