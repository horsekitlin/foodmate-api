const isEmpty = require('lodash/isEmpty');
const SQL = require('sql-template-strings');
const { query } = require('./mysqlConnectionPool');

const parseEvent = event => {
  const tags = isEmpty(event.tags)
    ? undefined
    : JSON.parse(event.tags);
  const google_json = isEmpty(event.google_json)
    ? undefined
    : JSON.parse(event.google_json);

  return { ...event, tags, google_json };
};

module.exports.getEvents = () => {
  const sql = SQL`
    SELECT
      event_id,
      logo,
      name,
      tags,
      owner_id,
      events.created_at as created_at,
      users.display_name as owner_name
    FROM
      events
    INNER JOIN users ON users.uid = events.owner_id
    WHERE 1
  `;

  return query(sql).then(events => {
    return events.map(parseEvent)
  });
};

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