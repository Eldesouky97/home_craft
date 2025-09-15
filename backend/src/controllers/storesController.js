const { pool } = require('../db');
const listStores = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id,name,description FROM stores LIMIT 100');
    res.json(rows);
  } catch (err) { next(err); }
};
module.exports = { listStores };