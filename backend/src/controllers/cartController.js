const { pool } = require('../db');
const getCart = async (req, res, next) => {
  try {
    // For demo purposes cart is per-user via query userId (in production use auth middleware)
    const userId = req.query.userId || 1;
    const [rows] = await pool.query('SELECT c.id,c.product_id,c.qty,p.title,p.price FROM cart c JOIN products p ON c.product_id=p.id WHERE c.user_id = ?', [userId]);
    res.json(rows);
  } catch (err) { next(err); }
};
const addItem = async (req, res, next) => {
  try {
    const { userId=1, productId, qty=1 } = req.body;
    await pool.query('INSERT INTO cart (user_id,product_id,qty,created_at) VALUES (?,?,?,NOW())', [userId, productId, qty]);
    res.status(201).json({ message: 'added' });
  } catch (err) { next(err); }
};
const removeItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM cart WHERE id = ?', [id]);
    res.json({ message: 'removed' });
  } catch (err) { next(err); }
};
module.exports = { getCart, addItem, removeItem };