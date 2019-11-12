const SQL = require('sql-template-strings');
const { query } = require('./mysqlConnectionPool');

module.exports.joinEvent = (event_id, uid, comment) => {
  const sql = SQL`
    INSERT INTO
      event_users
    (
      event_id,
      uid,
      stat,
      comment
    ) VALUES (
      ${event_id},
      ${uid},
      0,
      ${comment}
    )
  `;

  return query(sql);
};

module.exports.getMemberInEventBy = (uid) => {
  const sql = SQL`
    SELECT
      uid
    FROM
      event_users
    WHERE
      uid=${uid}
  `;
  return query(sql).then(([member = {}]) => member);
}

module.exports.checkMemberInEvent = (uid, event_id) => {
  const sql = SQL`
    SELECT if(count(*)>=1 ,1 ,0) as tf
    FROM event_users
    WHERE uid = ${uid} and event_id = ${event_id}
  `;
  return query(sql)
}