const SQL = require('sql-template-strings');
const { saltHashPassword } = require("../helpers/utils");
const { query } = require('./mysqlConnectionPool');


module.exports.getUserByPhone = (phone_number, withPasswordField = false) => {
  const sql = SQL`
    SELECT
      *
    FROM
      users
    WHERE phone_number=${phone_number}
  `;
  return query(sql).then(([user]) => {
    return withPasswordField ? user : { ...user, password_hash: undefined };
  }).then(user => ({
    ...user,
    is_notification: Boolean(user.is_notification),
    is_camera: Boolean(user.is_camera),
    is_album: Boolean(user.is_album),
    disabled: Boolean(user.disabled),
  }));
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

  return query(sql);
};
