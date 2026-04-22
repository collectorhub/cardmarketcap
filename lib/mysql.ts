import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // This helps with certain remote MySQL configurations
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export async function query(sql: string, params: any[]) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
}