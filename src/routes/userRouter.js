const express = require('express');
const router = express.Router();
const yup = require('yup');
const { responseErrWithMsg } = require('../helpers/response');
const { parseBooleanToInt, saltHashPassword } = require("../helpers/utils");
const userQueries = require("../models/userQueries");
const { responseOk } = require('../helpers/response');


// 1.4 Create User

const createRequestShape = yup.object().shape({
  email: yup.string().required('email 不可為空'),
  password: yup.string().required('password 不可為空'),
  phone_number: yup.string().required('phone_number 不可為空'),
  display_name: yup.string().required('display_name 不可為空'),
  gender: yup.mixed().oneOf(['M', "F", "U"]).required('gender 不可為空'),
  job_title: yup.string().required('job_title 不可為空'),
  soul_food: yup.number(),
  info: yup.string().required('info 不可為空'),
  photo_url: yup.string().required('photo_url 不可為空'),
  rate: yup.number().required('rate 不可為空'),
  is_notification: yup.boolean(),
  is_camera: yup.boolean(),
  is_album: yup.boolean(),
  disabled: yup.boolean(),
});

router.post('/', async (req, res) => {
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

    const result = await userQueries.createUser({
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

// 1.5 Delete Account

const disableUserRequestShape = yup.object().shape({
  disabled: yup.boolean()
});

router.put('/disableUser/:uid', async (req, res) => {
  try {
    await disableUserRequestShape.validate(req.body);
    const { 
      uid
    } = req.params;

    const result = await userQueries.disableUser(uid, req.body);

    if (result.constructor.name === 'OkPacket') {
      const user = await userQueries.getUserBy (uid);
      return responseOk(res, { success: true, disabled: user.disabled });
    }
    return responseErrWithMsg(res, '刪除失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

// 2.1 Get User Information

router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userQueries.getUserBy(uid);
    return responseOk(res, { success: true, data: user })
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

// 2.3 Update User Info

const updateUserInfoRequestShape = yup.object().shape({
  display_name: yup.string().required('display_name 不可為空'),
  gender: yup.mixed().oneOf(['M', "F", "U"]).required('gender 不可為空'),
  job_title: yup.string().required('job_title 不可為空'),
  soul_food: yup.number(),
  info: yup.string().required('info 不可為空')
});

router.put('/updateUserInfo/:uid', async (req, res) => {
  try {
    await updateUserInfoRequestShape.validate(req.body);
    const { 
      uid
    } = req.params;

    const result = await userQueries.updateUserInfo(uid, req.body);

    if (result.constructor.name === 'OkPacket') {
      const userInfo = await userQueries.getUserBy (uid);
      return responseOk(res, { success: true, data: userInfo });
    }
    return responseErrWithMsg(res, '更新失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

// 2.4 Update User Setting

const updateUserSettingRequestShape = yup.object().shape({
  is_notification: yup.boolean(),
  is_camera: yup.boolean(),
  is_album: yup.boolean()
});

router.put('/updateUserSetting/:uid', async (req, res) => {
  try {
    await updateUserSettingRequestShape.validate(req.body);
    const { 
      uid
    } = req.params;

    const result = await userQueries.updateUserSetting(uid, req.body);

    if (result.constructor.name === 'OkPacket') {
      const userSetting = await userQueries.getUserBy (uid);
      return responseOk(res, { success: true, data: userSetting });
    }
    return responseErrWithMsg(res, '更新失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;