module.exports = (mockApp) => describe('Test authorization user routes', () => {

  it('should login success', async done => {
    const mockAdminUserLoginBody = {
      phone_number: "0987654321",
      password: "a12345678"
    };

    mockApp
      .post('/v1/login')
      .set('Content-Type', 'application/json')
      .send(mockAdminUserLoginBody)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).not.toBe(undefined);
        done();
      }).catch(done);
  });
});
