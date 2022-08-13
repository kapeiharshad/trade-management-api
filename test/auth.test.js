const app = require('../app');
const request = require('supertest');
const { setupDB } = require('./test-config/testSetup');
setupDB(true);

describe(`Auth API's test cases`, function () {
  let adminToken = '';
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
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.token).not.toBe('');
    adminToken = response.body.token;
  });

  it('Test case to change password', async function () {
    const reqObj = {
      oldPassword: 'password',
      newPassword: 'password12',
    };
    const response = await request(app)
      .post('/auth/changePassword')
      .send(reqObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      'Password changed successfully',
    );
  });

  it('Test case for sucessfully admin logout', async function () {
    const reqObj = {
      token: adminToken,
    };
    const response = await request(app)
      .post('/auth/logout')
      .send(reqObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', 'Logout successfully');
  });
});
