const express = require('express');
const router = express.Router();
const yup = require('yup');
const { responseErrWithMsg } = require('../helpers/response');
const { parseBooleanToInt, saltHashPassword } = require("../helpers/utils");
const userQueries = require("../models/userQueries");
const { responseOk } = require('../helpers/response');


// 1.4 [POST] Create User

const createRequestShape = yup.object().shape({
  email: yup.string().email('email 格式不符').required('email 不可為空'),
  password: yup.string().required('password 不可為空'),
  re_password: yup.string().required('re_password 不可為空'),
  phone_number: yup.string().length(10).required('phone_number 不可為空')
});

router.post('/createUser', async (req, res) => {
  try {
    await createRequestShape.validate(req.body);
    const {
      email,
      password,
      re_password,
      phone_number
    } = req.body;
    if (password != re_password) {
      return responseErrWithMsg(res, "密碼不一致，請重新輸入");
    }
    const [findUser] = await userQueries.checkUserByEmailAndPhone(email, phone_number)
    if (findUser.tf === 1) {
      return responseErrWithMsg(res, "建立使用者失敗，Email or phone_number 已重複");
    } 
    else {
      const result = await userQueries.createUser(
        {
          email,
          password_hash: saltHashPassword(password),
          phone_number
        }
      );
      if (result.constructor.name === "OkPacket") {
        return responseOk(res, { success: true });
      }
      return responseErrWithMsg(res, "建立使用者失敗");
    }
  } catch (error) {
  return responseErrWithMsg(res, error.message);
  }
});

// 1.5 [PUT] Delete Account

const disableUserRequestShape = yup.object().shape({
  is_deleted: yup.boolean().required("is_deleted 不得為空")
});

router.put('/disableUser/:uid', async (req, res) => {
  try {
    await disableUserRequestShape.validate(req.body);
    const { 
      uid
    } = req.params;

    const result = await userQueries.deleteUser(uid, req.body);

    if (result.constructor.name === 'OkPacket') {
      const user = await userQueries.getUserBy (uid);
      return responseOk(res, { success: true, is_deleted: user.is_deleted });
    }
    return responseErrWithMsg(res, '刪除失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

// 2.1 Get User Information

router.get("/info/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userQueries.getUserBy(uid);
    return responseOk(res, {
      success: true,
      info: {
        display_name: user.display_name,
        photo_url: user.photo_url,
        job_title: user.job_title,
        rate: user.rate,
        info: user.info
      }
    });
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

// 2.3 Update User Info

const updateUserInfoRequestShape = yup.object().shape({
  display_name: yup.string().required('display_name 不可為空'),
  gender: yup.mixed().oneOf(['M', "F", "U"]).required('gender 不可為空'),
  job_title: yup.string().required('job_title 不可為空'),
  soul_food: yup.number().required('soul_food 不可為空'),
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

// 2.4 [PUT] Update User Setting

const updateUserSettingRequestShape = yup.object().shape({
  is_notification: yup.boolean().required("is_notification 不得為空"),
  is_camera: yup.boolean().required("is_camera 不得為空"),
  is_album: yup.boolean().required("is_album 不得為空")
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

// 2.6 [GET] Get User Detail

router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userQueries.getUserBy(uid);
    return responseOk(res, { success: true, data: user })
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

// 2.7 [GET] Check Display Name

router.get("/checkDisplayName/:display_name", async (req, res) => {
  try {
    const { display_name } = req.params;
    const [checkUserResult] = await userQueries.checkUserByName(display_name);
    console.log(checkUserResult)
    if (checkUserResult.tf === 1){
      return responseOk(res, { success: true, is_repeat: true, message: "不好意思這個名稱已經有人使用囉" })
    } else { 
      return responseOk(res, { success: true, is_repeat: false, message: "請安心使用這個名稱" })
    }
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});


module.exports = router;