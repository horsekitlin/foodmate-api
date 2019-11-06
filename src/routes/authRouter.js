const express = require('express');
const { generateToken } = require('../helpers/utils');
const passport = require('passport');
const pick = require('lodash/pick');
const yup = require('yup');
const { responseOk, responseErrWithMsg } = require('../helpers/response');

const loginRequestShape = yup.object().shape({
  phone_number: yup.string().required('phone_number 不可為空'),
  password: yup.string().required('password 不可為空')
});

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    await loginRequestShape.validate(req.body);
    passport.authenticate('local', (err, {password_hash, ...user}) => {
      if (err) return responseErrWithMsg(res, err.message);
      const signInfo = pick(user, ['uid']);
      const token = generateToken(signInfo);

      return responseOk(res, {
        success: true,
        data: { token, user }
      });
    })(req, res, next);
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;
