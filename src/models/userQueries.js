const SQL = require('sql-template-strings');
const { saltHashPassword } = require("../helpers/utils");
const { query } = require('./mysqlConnectionPool');

const parseUser = (user = {}) => 
({
  ...user,
  is_notification: Boolean(user.is_notification),
  is_camera: Boolean(user.is_camera),
  is_album: Boolean(user.is_album),
  disabled: Boolean(user.disabled),
});

module.exports.getUserBy = (uid, withPasswordField = false) => {
  const sql = SQL`
    SELECT
      *
    FROM
      users
    WHERE uid=${uid}
  `;
  return query(sql).then(([user = {}]) => {
    return withPasswordField ? user : { ...user, password_hash: undefined };
  }).then(parseUser);
};

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
  }).then(parseUser);
};

module.exports.checkUserByEmailAndPhone = (email, phone_number) => {
  const sql = SQL`
    SELECT if(count(*)>=1 ,1 ,0) as tf
    FROM users
    WHERE email = ${email} or phone_number = ${phone_number}
  `;
  return query(sql)
};

module.exports.checkUserByName = (display_name) => {
  const sql = SQL`
    SELECT if(count(*)>=1 ,1 ,0) as tf
    FROM users
    WHERE display_name = ${display_name}
  `;
  return query(sql)
};

module.exports.createUser = (payload) => {
  const {
    email,
    password_hash,
    phone_number
  } = payload;

  const sql = SQL`
    INSERT INTO
      users
    (
      email,
      password_hash,
      phone_number
    ) VALUES (
      ${email},
      ${password_hash},
      ${phone_number}
    )
  `;
  return query(sql);
};

module.exports.updateUserInfo = (uid, payload) => {
  const sql = SQL`
    UPDATE
      users
    SET
      soul_food = ${payload.soul_food},
      display_name = ${payload.display_name},
      job_title = ${payload.job_title},
      info = ${payload.info},
      gender = ${payload.gender}
    WHERE
      uid = ${uid}
  `;
  return query(sql);
};

module.exports.updateUserSetting = (uid, payload) => {
  const sql = SQL`
    UPDATE
      users
    SET
      is_notification = ${payload.is_notification},
      is_camera = ${payload.is_camera},
      is_album = ${payload.is_album}
    WHERE
      uid=${uid}
  `;
  return query(sql);
};

module.exports.disableUser = (uid, payload) => {
  const sql = SQL`
    UPDATE
      users
    SET
      disabled = ${payload.disabled}
    WHERE
      uid=${uid}
  `;
  return query(sql);
};

module.exports.deleteUser = (uid, payload) => {
  const sql = SQL`
    UPDATE
      users
    SET
      is_deleted = ${payload.is_deleted}
    WHERE
      uid=${uid}
  `;
  return query(sql);
};