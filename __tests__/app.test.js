const app = require('../app');
const request = require('supertest');
const authRouterTest = require('../__specs__/routes/authRouter.test');
// require('../src/models/mysqlConnectionPool');

const mockApp = request(app);


describe('test app', () => {
  authRouterTest(mockApp);
});