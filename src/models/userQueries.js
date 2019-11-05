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
  return query(sql);
};

module.exports.createUser = (payload) => {
  const {
    email,
    password,
    phone_number,
    display_name,
    gender,
    job_title,
    soul_food,
    info,
    photo_url,
    rage,
    is_notification,
    is_camera,
    is_album,
    disabled
  } = payload;

  const hash_password = saltHashPassword(password);
  const sql = SQL`
    INSERT INTO
    (
      email,
      hash_password,
      phone_number,
      display_name,
      gender,
      job_title,
      soul_food,
      info,
      photo_url,
      rage,
      is_notification,
      is_camera,
      is_album,
      disabled
    ) VALUES (
      ${email},
      ${password},
      ${phone_number},
      ${display_name},
      ${gender},
      ${job_title},
      ${soul_food},
      ${info},
      ${photo_url},
      ${rage},
      ${is_notification},
      ${is_camera},
      ${is_album},
      ${disabled}
    )
  `;

  return query(sql);
};
