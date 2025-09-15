const { pool } = require('../db');

const listProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT p.id,p.title,p.price,p.image,c.name AS category, s.name AS store FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN stores s ON p.store_id=s.id LIMIT 100');
    res.json(rows);
  } catch (err) { next(err); }
};

const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT p.*, c.name AS category, s.name AS store FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN stores s ON p.store_id=s.id WHERE p.id = ? LIMIT 1', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

module.exports = { listProducts, getProduct };