const app = require('../app');
const request = require('supertest');
const { setupDB } = require('./test-config/testSetup');
setupDB(true);

describe(`Cart API's test cases`, function () {
  let userToken = '',
    cartId = '';
  it('Test case for sucessfully User login', async function () {
    const reqObj = {
      email: 'user@yopmail.com',
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
    userToken = response.body.token;
  });

  it('Test case to add in cart successfully', async function () {
    const cartObj = {
      productId: '62dbfaf07e7ccb28caf17d95',
      quantity: 1,
    };
    const response = await request(app)
      .post('/cart/')
      .send(cartObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      'Product Added In Cart Successfully',
    );
    expect(response.body).toHaveProperty('id');
    cartId = response.body.id;
  });

  it('Test case to add in cart with invalid productId', async function () {
    const cartObj = {
      productId: '62dbfaf07e7ccb28caf17d9',
      quantity: 1,
    };
    const response = await request(app)
      .post('/cart/')
      .send(cartObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorName', 'INVALID VALIDATION');
    expect(response.body).toHaveProperty('errorMsg[0].msg', 'Invalid objectId');
  });

  it('Test case to add in cart with invalid userToken', async function () {
    const cartObj = {
      productId: '62dbfaf07e7ccb28caf17d93',
      quantity: 1,
    };
    const response = await request(app)
      .post('/cart/')
      .send(cartObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + 'dtreaztygbjgvrtzxhjbc');
    expect(response.status).toEqual(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorName', 'SERVER ERROR');
    expect(response.body).toHaveProperty(
      'errors[0].msg',
      'An error occur while authenticating user.',
    );
  });

  it('Test case to get one product from users cart successfully', async function () {
    const response = await request(app)
      .get(`/cart/${cartId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('record._id', cartId);
    expect(response.body).toHaveProperty(
      'msg',
      'Cart Data Fetched Successfully',
    );
  });

  it('Test case to get one product from users cart with incorrect cartId', async function () {
    const response = await request(app)
      .get('/cart/62dbfaf07e7ccb28caf17d95')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    console.log('response response', response.body);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorName', 'EXECUTION FAILURE');
    expect(response.body).toHaveProperty(
      'errors[0].msg',
      'No Data Found In Cart',
    );
  });

  it('Test case to update product quantity in users cart with cartId successfully', async function () {
    const cartObj = {
      quantity: 2,
    };
    const response = await request(app)
      .patch(`/cart/${cartId}`)
      .send(cartObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    console.log('response response', response.body);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      'Changed Product Quantity In Cart Successfully',
    );
  });

  it('Test case to update product quantity in users cart with incorrect cartId', async function () {
    const cartObj = {
      quantity: 2,
    };
    const response = await request(app)
      .patch('/cart/62dbfaf07e7ccb28caf17d95')
      .send(cartObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    console.log('response response', response.body);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorName', 'EXECUTION FAILURE');
    expect(response.body).toHaveProperty(
      'errors[0].msg',
      'Product Not Found In Cart',
    );
  });

  it('Test case to get all products from users cart successfully', async function () {
    const response = await request(app)
      .get('/cart/')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    console.log('response response', response.body.records.doc[0]._id);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('records.doc[0]._id', cartId);
    expect(response.body).toHaveProperty(
      'msg',
      'Cart Data Fetched Successfully',
    );
  });

  it('Test case to delete one product from users cart with cartId successfully', async function () {
    const response = await request(app)
      .delete(`/cart/${cartId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    console.log('response response', response.body);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      'Product Removed From Cart SuccessFully',
    );
  });

  it('Test case to delete one product from users cart with incorrect cartId', async function () {
    const response = await request(app)
      .delete('/cart/62dbfaf07e7ccb28caf17d95')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userToken);
    console.log('response response', response.body);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errorName', 'EXECUTION FAILURE');
    expect(response.body).toHaveProperty(
      'errors[0].msg',
      'Product Not Found In Cart',
    );
  });
});
