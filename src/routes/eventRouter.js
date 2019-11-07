const express = require('express');
const yup = require('yup');
const { responseOk, responseErrWithMsg } = require('../helpers/response');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    return responseOk(res, {
      success: true,
    });
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;
