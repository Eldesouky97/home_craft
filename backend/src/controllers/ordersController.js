const { pool } = require('../db');
const listOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id,user_id,total,status,created_at FROM orders ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch (err) { next(err); }
};
const createOrder = async (req, res, next) => {
  try {
    const { userId=1, total=0 } = req.body;
    const [result] = await pool.query('INSERT INTO orders (user_id,total,status,created_at) VALUES (?,?,?,NOW())', [userId, total, 'pending']);
    res.status(201).json({ id: result.insertId });
  } catch (err) { next(err); }
};
module.exports = { listOrders, createOrder };