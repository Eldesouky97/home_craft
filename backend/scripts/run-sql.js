const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function runFile(file) {
  const full = path.join(__dirname, '..', file);
  if (!fs.existsSync(full)) { console.error('File not found', full); process.exit(1); }
  const sql = fs.readFileSync(full, 'utf8');
  const conn = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  try {
    console.log('Running SQL file', full);
    await conn.query(sql);
    console.log('Done');
  } finally {
    await conn.end();
  }
}

const argv = require('minimist')(process.argv.slice(2));
if (!argv.file) { console.error('--file is required'); process.exit(1); }
runFile(argv.file).catch(err => { console.error(err); process.exit(1); });