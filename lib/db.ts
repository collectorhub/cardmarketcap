import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export const getDb = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: 3306, // Explicitly add the MySQL port
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5, // Lowering this for cPanel stability
      queueLimit: 0,
      connectTimeout: 20000, // Giving it 20s to find the remote server
    });
  }
  return pool;
};