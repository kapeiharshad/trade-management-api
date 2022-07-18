const app = require('../app');
const request = require('supertest');
const { setupDB } = require('./test-config/testSetup');
setupDB(true);

describe(`Auth API's test cases`, function () {
  it('Test case for sucessfully admin login', async function () {
    const reqObj = {
      email: 'admin@yopmail.com',
      password: 'password',
    };
    const response = await request(app)
      .post('/auth/login')
      .send(reqObj)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('token');
  });
});
