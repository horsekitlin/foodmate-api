const SQL = require('sql-template-strings');
const { saltHashPassword } = require("../helpers/utils");
const { query } = require('./mysqlConnectionPool');


module.exports.getUserByEmail = (email, withPasswordField = false) => {
  const sql = SQL`
    SELECT
      *
    FROM
      users
    WHERE email=${email}
  `;
  return query(sql).then(([user]) => {
    return withPasswordField ? user : { ...user, password_hash: undefined };
  });
};

module.exports.createUser = (payload) => {

  console.log("TCL: module.exports.createUser -> payload", payload, 4)
  const {
    email,
    password_hash,
    phone_number,
    display_name,
    gender,
    job_title,
    soul_food,
    info,
    photo_url,
    rate,
    is_notification,
    is_camera,
    is_album,
    disabled
  } = payload;

  const sql = SQL`
    INSERT INTO
      users
    (
      email,
      password_hash,
      phone_number,
      display_name,
      gender,
      job_title,
      soul_food,
      info,
      photo_url,
      rate,
      is_notification,
      is_camera,
      is_album,
      disabled
    ) VALUES (
      ${email},
      ${password_hash},
      ${phone_number},
      ${display_name},
      ${gender},
      ${job_title},
      ${soul_food},
      ${info},
      ${photo_url},
      ${rate},
      ${is_notification},
      ${is_camera},
      ${is_album},
      ${disabled}
    )
  `;

  const qu = `
  INSERT INTO
    users
  (
    email,
    password_hash,
    phone_number,
    display_name,
    gender,
    job_title,
    soul_food,
    info,
    photo_url,
    rate,
    is_notification,
    is_camera,
    is_album,
    disabled
  ) VALUES (
    ${email},
    ${password_hash},
    ${phone_number},
    ${display_name},
    ${gender},
    ${job_title},
    ${soul_food},
    ${info},
    ${photo_url},
    ${rate},
    ${is_notification},
    ${is_camera},
    ${is_album},
    ${disabled}
  )
`;
  console.log("TCL: module.exports.createUser -> qu", qu)
  return query(sql);
};
