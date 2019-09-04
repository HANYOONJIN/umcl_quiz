import mysql from "mysql";
const conn = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'gksdbswls1',
  database: 'yj'
});

export default conn;
