const express = require('express');
const yup = require('yup');
const { responseOk, responseErrWithMsg } = require('../helpers/response');
const { createEvent, getEvents, getEvent } = require('../models/eventQueries');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await getEvents();

    return responseOk(res, { success: true, data: { events } });
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

router.get('/:event_id', async (req, res) => {
  try {
    const {event_id} = req.params;

    const event = await getEvent(event_id);

    return responseOk(res, { success: true, data: event });
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

const createRequestShape = yup.object().shape({
  description: yup.string().required('description 不可為空'),
  logo: yup.string().required('logo 不可為空'),
  name: yup.string().required('name 不可為空'),
  address: yup.string().required('address 不可為空'),
  payment_method: yup.string().required('payment_method 不可為空'),
  event_date: yup.string().required('event_date 不可為空'),
  validate_date: yup.string().required('validate_date 不可為空'),
  tags: yup.array().required('tags 不可為空'),
  google_json: yup.object().required('google_json 不可為空'),
  max_member: yup.number().required('max_member 不可為空'),
  member_count: yup.number().required('member_count 不可為空'),
  budget: yup.number().required('budget 不可為空'),
});

router.post('/', async (req, res, next) => {
  try {
    await createRequestShape.validate(req.body);
    const { user } = req;

    const result = await createEvent(user.uid, req.body);

    if (result.constructor.name === 'OkPacket') {
      return responseOk(res, { success: true, data: { event_id: result.insertId } });
    }
    return responseErrWithMsg(res, '新增活動失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;
