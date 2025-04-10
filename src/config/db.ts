import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import config from '.';

dotenv.config();

// Create a connection pool
const DB = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  port: Number(config.dbPort) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await DB.getConnection();
    console.log('Database connection established successfully');
    connection.release();
  } catch (error) {
    console.error('Failed to connect DB:', error);
    throw error;
  }
};

export default DB;
