const express = require('express');
const yup = require('yup');
const isEmpty = require('lodash/isEmpty');
const { responseOk, responseErrWithMsg } = require('../helpers/response');
const { createEvent, getEvents, getEvent, replaceEvent, deleteEvent } = require('../models/eventQueries');
const { joinEvent, getMemberInEventBy } = require('../models/eventUserQueries');

const router = express.Router();

const joinEventRequestShape = yup.object().shape({
  comment: yup.string().required('comment 不可為空'),
});

router.post('/:event_id/members', async (req, res) => {
  try {
    await joinEventRequestShape.validate(req.body);
    const { comment } = req.body;
    const { user, params } = req;
    const { uid } = user;

    const { event_id } = params;
    const event = await getEvent(event_id);

    const member = await getMemberInEventBy(uid);
    if(!isEmpty(member)) {
      return responseErrWithMsg(res, '您已經在活動內');
    }

    if (event.owner_id === user.uid) {
      return responseErrWithMsg(res, '主揪不可重複參加活動');
    }

    if (event.max_member >= event.member_count) {
      return responseErrWithMsg(res, '此活動已額滿');
    }

    const result = await joinEvent(event_id, uid, comment);

    if (result.constructor.name === 'OkPacket') {
      return responseOk(res, { success: true });
    }
    return responseErrWithMsg(res, '加入揪團失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

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
    const { event_id } = req.params;

    const event = await getEvent(event_id);

    return responseOk(res, { success: true, data: event });
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

const eventRequestShape = yup.object().shape({
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

router.put('/:event_id', async (req, res) => {
  try {
    await eventRequestShape.validate(req.body);
    const { event_id } = req.params;
    const result = await replaceEvent(event_id, req.body);

    if (result.constructor.name === 'OkPacket') {
      const event = await getEvent(event_id);
      return responseOk(res, { success: true, data: event });
    }
    return responseErrWithMsg(res, '編輯活動失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await eventRequestShape.validate(req.body);
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

router.delete('/:event_id', async (req, res) => {
  try {
    const { event_id } = req.params;
    const result = await deleteEvent(event_id);

    if (result.constructor.name === 'OkPacket') {
      return responseOk(res, { success: true });
    }
    return responseErrWithMsg(res, '編輯活動失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;
