import mysql from "mysql2";
import env from "dotenv";
env.config();
export default class DBConnection {
  conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DBUSER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
  });
}
