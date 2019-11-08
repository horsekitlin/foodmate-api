const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { SALT_SECRET, AUTH_SECRET } = process.env;

module.exports.debugLog = msg => console.log(`[debug] ${msg}`);

module.exports.parseJson = jsonString =>
  isEmpty(jsonString)
    ? undefined
    : JSON.parse(jsonString);

module.exports.parseBooleanToInt = (bool) => {
  return Number(bool);
};

const sha512 = function(password, salt) {
  const hash = crypto.createHmac(
    'sha512',
    salt
  ); /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value.toString()
  };
};

module.exports.saltHashPassword = userpassword => {
  const passwordData = sha512(userpassword, SALT_SECRET);
  return passwordData.passwordHash;
};

module.exports.generateToken = user => jwt.sign(user, AUTH_SECRET);

module.exports.getTotalPage = (total_count, size) => {
  return Math.ceil(total_count / size); 
};
