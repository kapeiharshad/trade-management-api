const app = require('../app');
const request = require('supertest');
const { setupDB } = require('./test-config/testSetup');
setupDB(true);

describe(`User API's test cases`, function () {
  let userId = '';
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
    adminToken = response.body.token;
  });

  it('Test case to create a user sucessfully', async function () {
    const userObj = {
      userName: 'kailash054',
      firstName: 'kailash kumar',
      lastName: 'Yadav',
      contact: '9782561655',
      gender: 'Male',
      email: 'kailash054@yopmail.com',
      password: '1234567890',
      userType: 'user',
      status: 'active',
    };
    const response = await request(app)
      .post('/user/')
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', 'User added successfully.');
    expect(response.body).toHaveProperty('id');
    userId = response.body.id;
  });

  it('Should get error of invalid email whlie create a user sucessfully', async function () {
    const userObj = {
      userName: 'kailash0545',
      firstName: 'kailash kumar',
      lastName: 'Yadav',
      contact: '8782561655',
      gender: 'Male',
      email: 'kailash0545@yopmail',
      password: '1234567890',
      userType: 'user',
      status: 'active',
    };
    const response = await request(app)
      .post('/user/')
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorMsg');
    expect(response.body).toHaveProperty('errorMsg[0].msg', `email is invalid`);
  });

  it('Should get error of invalid contact no whlie create a user sucessfully', async function () {
    const userObj = {
      userName: 'kailash1541',
      firstName: 'kailash kumar',
      lastName: 'Yadav',
      contact: '9782',
      gender: 'Male',
      email: 'kailash1541@yopmail.com',
      password: '1234567890',
      userType: 'user',
      status: 'active',
    };
    const response = await request(app)
      .post('/user/')
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorMsg');
    expect(response.body).toHaveProperty(
      'errorMsg[0].msg',
      `length should be 10 characters`,
    );
  });

  it('Should get error of required userName whlie create a user sucessfully', async function () {
    const userObj = {
      firstName: 'kailash kumar',
      lastName: 'Yadav',
      contact: '9999921921',
      email: 'kailash124@yopmail.com',
      password: '1234567890',
      userType: 'user',
      status: 'active',
    };
    const response = await request(app)
      .post('/user/')
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorMsg');
    expect(response.body).toHaveProperty(
      'errorMsg[0].msg',
      `userName is invalid`,
    );
  });

  it('Should get error of required contact whlie create a user sucessfully', async function () {
    const userObj = {
      userName: 'kailash5945',
      firstName: 'kailash kumar',
      lastName: 'Yadav',
      email: 'kailash5945@yopmail.com',
      password: '1234567890',
      userType: 'user',
      status: 'active',
    };
    const response = await request(app)
      .post('/user/')
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorMsg');
    expect(response.body).toHaveProperty(
      'errorMsg[0].msg',
      `contact is invalid`,
    );
  });

  it('Test case to edit user successfully', async function () {
    const userObj = {
      userName: 'kailash111',
      email: 'kailash111@yopmail.com',
    };
    const response = await request(app)
      .patch(`/user/${userId}`)
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', `User edited successfully.`);
  });

  it('Should get error if username is empty while editing user', async function () {
    const userObj = {
      userName: '',
    };
    const response = await request(app)
      .patch(`/user/${userId}`)
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty(
      'errorMsg[0].msg',
      `length should be between 1 to 100 characters`,
    );
  });

  it('Should get error if email is invalid while editing user', async function () {
    const userObj = {
      email: 'kaisl@ vfk.in',
    };
    const response = await request(app)
      .patch(`/user/${userId}`)
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorMsg[0].msg', `email is invalid`);
  });

  it('Should get error if contact is invalid while editing user', async function () {
    const userObj = {
      contact: '+62360',
    };
    const response = await request(app)
      .patch(`/user/${userId}`)
      .send(userObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty(
      'errorMsg[0].msg',
      `length should be 10 characters`,
    );
  });

  it('Test case to get all users', async function () {
    const response = await request(app)
      .get(`/user?limit=10&page=1`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', `Users fetched successfully.`);
    expect(response.body).toHaveProperty('records');
    expect(response.body).toHaveProperty('records.docs');
    expect(response.body.records.docs[1]).toHaveProperty('_id', userId);
    expect(response.body.records.docs[1]).toHaveProperty(
      'firstName',
      'kailash kumar',
    );
    expect(response.body.records.docs[1]).toHaveProperty('lastName', 'Yadav');
    expect(response.body.records.docs[1]).toHaveProperty(
      'userName',
      'kailash111',
    );
    expect(response.body.records.docs[1]).toHaveProperty(
      'contact',
      '9782561655',
    );
    expect(response.body.records.docs[1]).toHaveProperty('gender', 'Male');
    expect(response.body.records.docs[1]).toHaveProperty(
      'email',
      'kailash111@yopmail.com',
    );
    expect(response.body.records.docs[1]).toHaveProperty('userType', 'user');
    expect(response.body.records.docs[1]).toHaveProperty('status', 'active');
    expect(response.body).toHaveProperty('records.limit', 10);
    expect(response.body).toHaveProperty('records.total', 2);
    expect(response.body).toHaveProperty('records.page', 1);
    expect(response.body).toHaveProperty('records.pages', 1);
  });

  it('Test case to get user by ID', async function () {
    const response = await request(app)
      .get(`/user/${userId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', `User fetched successfully.`);
    expect(response.body).toHaveProperty('record');
    expect(response.body.record).toHaveProperty('_id', userId);
    expect(response.body.record).toHaveProperty('firstName', 'kailash kumar');
    expect(response.body.record).toHaveProperty('lastName', 'Yadav');
    expect(response.body.record).toHaveProperty('userName', 'kailash111');
    expect(response.body.record).toHaveProperty('contact', '9782561655');
    expect(response.body.record).toHaveProperty('gender', 'Male');
    expect(response.body.record).toHaveProperty(
      'email',
      'kailash111@yopmail.com',
    );
    expect(response.body.record).toHaveProperty('userType', 'user');
    expect(response.body.record).toHaveProperty('status', 'active');
  });

  it('Test case to delete user by ID', async function () {
    const response = await request(app)
      .delete(`/user/${userId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', `User deleted successfully.`);
  });
});
