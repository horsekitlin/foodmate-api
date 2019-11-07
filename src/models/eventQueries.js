const SQL = require('sql-template-strings');
const { query } = require('./mysqlConnectionPool');

module.exports.createEvent = (owner_id, payload) => {
  const sql = SQL`
    INSERT INTO
      events
    (
      logo,
      owner_id,
      description,
      name,
      address,
      payment_method,
      event_date,
      validate_date,
      tags,
      google_json,
      max_member,
      member_count,
      budget
    ) VALUES (
      ${payload.logo},
      ${owner_id},
      ${payload.description},
      ${payload.name},
      ${payload.address},
      ${payload.payment_method},
      ${payload.event_date},
      ${payload.validate_date},
      ${JSON.stringify(payload.tags)},
      ${JSON.stringify(payload.google_json)},
      ${payload.max_member},
      ${payload.member_count},
      ${payload.budget}
    )
  `;

  return query(sql);
};