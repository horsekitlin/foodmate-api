const express = require('express');
const yup = require('yup');
const { responseOk, responseErrWithMsg } = require('../helpers/response');
const eventQueries = require('../models/eventQueries');
const eventUserQueries = require('../models/eventUserQueries');

const router = express.Router();



// 3.1 Get Events

router.get('/', async (req, res) => {
  const date = req.query.date;
  const uid = req.query.uid;
  try {
    const events = await eventQueries.getEvents(date, uid);
    return responseOk(res, { success: true, data: { events } });
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

// 3.2 Get Event Detail

router.get('/:event_id', async (req, res) => {
  try {
    const { event_id } = req.params;

    const event = await eventQueries.getEvent(event_id);

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

// 3.3 Get Application List && 3.4 Get Applicants List

router.get('/:event_id/applicationList', async (req, res) => {
  const event_id = req.params.event_id;
  const uid = req.query.uid;
  try {
    const events = await eventUserQueries.getApplicationList(event_id, uid);
    return responseOk(res, { success: true, data: { events } });
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});


//[POST] 3.6 Create Event

router.post('/', async (req, res, next) => {
  try {
    await eventRequestShape.validate(req.body);
    const { user } = req;

    const result = await eventQueries.createEvent(user.uid, req.body);

    if (result.constructor.name === 'OkPacket') {
      return responseOk(res, { success: true, data: { event_id: result.insertId } });
    }
    return responseErrWithMsg(res, '新增活動失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

const joinEventRequestShape = yup.object().shape({
  comment: yup.string().required('comment 不可為空'),
});

//[POST] 3.7 Join Event

router.post('/:event_id/joinEvent', async (req, res) => {
  try {
    await joinEventRequestShape.validate(req.body);
    const { comment } = req.body;
    const { user, params } = req;
    const { uid } = user;

    const { event_id } = params;
    const event = await eventQueries.getEvent(event_id);
    const [findMember] = await eventUserQueries.checkMemberInEvent(uid, event_id);
    if( findMember.tf === 1) {
      return responseErrWithMsg(res, '您已經在活動內');
    }

    if (event.owner_id === user.uid) {
      return responseErrWithMsg(res, '主揪不可重複參加活動');
    }

    if (event.member_count === event.max_member) {
      return responseErrWithMsg(res, '此活動已額滿');
    }

    const result = await eventUserQueries.joinEvent(event_id, uid, comment);

    if (result.constructor.name === 'OkPacket') {
      return responseOk(res, { success: true, message: "報名成功！請靜待主辦人通知囉" });
    }
    return responseErrWithMsg(res, '加入活動失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

// 3.8 Update Event

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

const updateJoinRequestShape = yup.object().shape({
  stat: yup.boolean().required('stat 不可為空'),
});

// 3.11 [PATCH] Update Join Status

router.patch('/:event_users_id/updateJoinStatus', async (req, res) => {
  try { 
    await updateJoinRequestShape.validate(req.body);
    const {stat} = req.body;
    const {event_users_id} = req.params;
    const result = await eventUserQueries.updateJoinStatus(event_users_id, stat);
    if (result.constructor.name === "OkPacket"){
      const event = await eventUserQueries.getEventUser(event_users_id);
      return responseOk(res, { success: true, data: { event } });
    }
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;
