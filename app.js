const dotenv = require('dotenv');
dotenv.config();

const Express = require('express');
const httpModule = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require("./src/helpers/passportManager");

const app = Express();
const http = httpModule.Server(app);

app.set('trust proxy', 1) // trust first proxy
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(session({
//   store: new RedisStore({
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//   }),
//   secret: AUTH_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: true,
//     maxAge: 60 * 60 * 24 * 1000 // 1天
//   }
// }));

const authRouter = require('./src/routes/authRouter');
const userRouter = require('./src/routes/userRouter');
const roomRouter = require('./src/routes/roomRouter');

app.use('/v1/login', authRouter);
app.use('/v1/users', userRouter);
app.use('/rooms', roomRouter);


http.listen(process.env.PORT || 3000, function () {
  console.log('listening on *:3000');
});

//Nodejs 奇怪的錯誤防止Process 死掉
process.on('uncaughtException', function (err) {
  (err);
})