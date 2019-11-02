const SQL = require('sql-template-strings');
const { query } = require('./mysqlConnectionPool');


module.exports.getUserByEmail = (email, withPasswordField = false) => {
  const sql = SQL`
    SELECT
      *
    FROM
      users
    WHERE email=${email}
  `;
  return query(sql);
};