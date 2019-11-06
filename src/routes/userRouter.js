const express = require('express');
const router = express.Router();
const yup = require('yup');
const { responseErrWithMsg } = require('../helpers/response');
const { parseBooleanToInt, saltHashPassword } = require("../helpers/utils");
const { createUser } = require("../models/userQueries");
const { responseOk } = require('../helpers/response');

const createRequestShape = yup.object().shape({
  email: yup.string().required('email 不可為空'),
  password: yup.string().required('password 不可為空'),
  phone_number: yup.string().required('phone_number 不可為空'),
  display_name: yup.string().required('display_name 不可為空'),
  gender: yup.string().required('gender 不可為空'),
  job_title: yup.string().required('job_title 不可為空'),
  soul_food: yup.string().required('soul_food 不可為空'),
  info: yup.string().required('info 不可為空'),
  photo_url: yup.string().required('photo_url 不可為空'),
  rate: yup.number().required('rate 不可為空'),
  is_notification: yup.boolean(),
  is_camera: yup.boolean(),
  is_album: yup.boolean(),
  disabled: yup.boolean(),
});

router.post('/created', async (req, res) => {
  try {
    await createRequestShape.validate(req.body);
    const {
      is_album,
      is_camera,
      is_notification,
      disabled,
      password,
      ...payload
    } = req.body;

    const result = await createUser({
      ...payload,
      is_album: parseBooleanToInt(is_album),
      is_camera: parseBooleanToInt(is_camera),
      is_notification: parseBooleanToInt(is_notification),
      disabled: parseBooleanToInt(disabled),
      password_hash: saltHashPassword(password),
    });
    if (result.constructor.name === 'OkPacket') {
      return responseOk(res, { success: true });
    }

    return responseErrWithMsg(res, "建立使用者失敗");
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;