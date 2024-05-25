import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config(); 

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to PostgreSQL successfully');
});

export default db;