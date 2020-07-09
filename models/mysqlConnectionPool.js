const mysql = require('promise-mysql');

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PORT,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

let pool = null;

mysql.createPool({
  connectionLimit     : 10,
  host     				    : MYSQL_HOST,
  user     				    : MYSQL_USER,
  port                : MYSQL_PORT,
  password 				    : MYSQL_PASSWORD,
  database 				    : MYSQL_DATABASE,
  timezone				    : 'utc',
}).then(p => {
  pool = p;
  return p;
});

module.exports.query = async sql => {
  const connection = await pool.getConnection();
  try {
    const result = await connection.query(sql);
    connection.release();
    return result;
  } catch (error) {
    connection.release();
    throw error;
  }
};