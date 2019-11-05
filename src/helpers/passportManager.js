const passport = require('passport');
const passportJWT = require("passport-jwt");
const isEmpty = require('lodash/isEmpty');
const LocalStrategy = require('passport-local').Strategy;
const userQueries = require('../models/userQueries');
const { saltHashPassword } = require('../helpers/utils');

const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const {AUTH_SECRET} = process.env;

const validateUserAndPassword = (user, password) => {
  if(isEmpty(user)) return {validated: false};

  const hashPassword = saltHashPassword(password);
  if(hashPassword !== user.password) return {validated: false};

  return {validated: true};
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {

      const user = await userQueries.getUserByEmail(email, true);
      const {validated} = validateUserAndPassword(user, password);
      if(!validated) {
        const message = '使用者不存在或密碼錯誤';
        const notfoundError = new Error(message);
        return done(notfoundError, null, {message});
      }
      return done(null, user);
    }
  )
);


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : AUTH_SECRET
},
async function (jwtPayload, done) {
  const {id} = jwtPayload;
  const user = await backendUserQueries.getBackendUserById(id);
  if(isEmpty(user)) done(new Error('無效的 token'));

  done(null, user, { message: 'Logged In Successfully' });
}
));

//Todo: 新增 session
passport.serializeUser((user, done) => {
  done(null, user);
});
//Todo: 移除 session
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports.jwtAuthorizationMiddleware = passport.authenticate('jwt', {session: true});
