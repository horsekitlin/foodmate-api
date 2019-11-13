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

module.exports.getEvents = (date, uid) => {
  let queryArray = [`1=1`];

  if( date !== undefined ){
    queryArray.push(`DATE(event_date) = CURDATE()`)
  }
  if(uid !== undefined ) {
    queryArray.push(`owner_id = ${uid}`)
  }
  const finalQueryArray = queryArray.join(" AND ")
  console.log(finalQueryArray)
  const sql = SQL`
    SELECT
      event_id,
      logo,
      name,
      tags,
      owner_id,
      event_date,
      users.display_name as owner_name,
      users.photo_url as owner_photo,
      users.soul_food as owner_soulfood
    FROM
      events
    INNER JOIN
      users
    ON
      users.uid = events.owner_id
  `;
  sql.append(`WHERE ${finalQueryArray}`);
  return query(sql)
};

module.exports.getEvent = (event_id) => {
  const sql = SQL`
    SELECT
      event_id,
      logo,
      name,
      tags,
      owner_id,
      event_date,
      validate_date,
      max_member,
      member_count,
      payment_method,
      budget,
      google_json,
      address,
      description,
      events.created_at as created_at,
      users.display_name as owner_name
    FROM
      events
    INNER JOIN
      users
    ON
      users.uid = events.owner_id
    WHERE event_id=${event_id}
  `;

  return query(sql).then(([event]) => {
    if(isEmpty(event)) return {};
    return parseEvent(event);
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

module.exports.replaceEvent = (event_id, payload) => {
  const sql = SQL`
    UPDATE
      events
    SET
      logo = ${payload.logo},
      description = ${payload.description},
      name = ${payload.name},
      address = ${payload.address},
      payment_method = ${payload.payment_method},
      event_date = ${payload.event_date},
      validate_date = ${payload.validate_date},
      tags = ${JSON.stringify(payload.tags)},
      google_json = ${JSON.stringify(payload.google_json)},
      max_member = ${payload.max_member},
      member_count = ${payload.member_count},
      budget = ${payload.budget}
    WHERE
      event_id = ${event_id}
  `;

  return query(sql);
};

module.exports.deleteEvent = (event_id) => {
  const sql = SQL`
    DELETE FROM
      events
    WHERE
      event_id=${event_id}
  `;

  return query(sql);
};
