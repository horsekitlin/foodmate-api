const mysql = require('promise-mysql');
const dotenv = require('dotenv');

const config = dotenv.config().parsed;

let pool = null;

mysql.createPool({
  connectionLimit     : 10,
  host     				    : config.MYSQL_HOST,
  user     				    : config.MYSQL_USER,
  port                : config.MYSQL_PORT,
  password 				    : config.MYSQL_PASSWORD,
  database 				    : config.MYSQL_DATABASE,
  timezone				    : 'utc',
}).then(p => {
  pool = p;
  console.log("TCL: pool.getConnection", pool.getConnection)
  return p;
});

module.exports.query = async sql => {
  const connection = await pool.getConnection();
  console.log("TCL: connection", connection)
  try {
    const result = await connection.query(sql);
    connection.release();
    return result;
  } catch (error) {
    connection.release();
    throw error;
  }
};