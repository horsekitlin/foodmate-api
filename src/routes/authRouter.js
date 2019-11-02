const express = require('express');
const { generateToken } = require('../helpers/utils');
const passport = require('passport');
const pick = require('lodash/pick');
const yup = require('yup');
const { responseOk, responseErrWithMsg } = require('../helpers/response');

const loginRequestShape = yup.object().shape({
  email: yup.string().required('email 不可為空'),
  password: yup.string().required('password 不可為空')
});

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    await loginRequestShape.validate(req.body);
    passport.authenticate('local', (err, user) => {
      if (err) return responseErrWithMsg(res, err.message);
      const signInfo = pick(user, ['uid']);
      const token = generateToken(signInfo);

      return responseOk(res, {
        success: true,
        data: { token, actor: user.actor, permissions: user.permissions }
      });
    })(req, res, next);
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;
