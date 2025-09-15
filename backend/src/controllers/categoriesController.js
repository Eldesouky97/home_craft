const { pool } = require('../db');
const listCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id,name,slug FROM categories');
    res.json(rows);
  } catch (err) { next(err); }
};
module.exports = { listCategories };