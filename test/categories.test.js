const app = require('../app');
const request = require('supertest');
const { setupDB } = require('./test-config/testSetup');
setupDB(true);
describe(`Category API's test cases`, function () {
  let adminToken = '',
    categoryId = '';
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

  it('Test case to create a category successfully', async function () {
    const categoryObj = {
      categoryName: 'nut bolt',
    };
    const response = await request(app)
      .post('/categories/')
      .send(categoryObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', 'Category Created Successfully');
    expect(response.body).toHaveProperty('id');
    categoryId = response.body.id;
  });

  it('Should get error of required category name whlie create a category sucessfully', async function () {
    const categoryObj = {};
    const response = await request(app)
      .post('/categories/')
      .send(categoryObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty(
      'msg',
      `categoryName is invalid of 'categoryName' at body location.`,
    );
    expect(response.body).toHaveProperty('errors');
  });

  it('Test case to edit a category sucessfully', async function () {
    const categoryObj = {
      categoryName: 'nut bolt',
    };
    const response = await request(app)
      .patch(`/categories/${categoryId}`)
      .send(categoryObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      'Category Updated Successfully',
    );
    userId = response.body.id;
  });
  it('Test case to edit a category sucessfully', async function () {
    const categoryObj = {
      categoryName: 'nut bolt',
    };
    const response = await request(app)
      .patch(`/categories/${categoryId}`)
      .send(categoryObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      'Category Updated Successfully',
    );
    userId = response.body.id;
  });

  it('Should get error of required category name whlie editing a category sucessfully', async function () {
    const categoryObj = {};
    const response = await request(app)
      .patch(`/categories/${categoryId}`)
      .send(categoryObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty(
      'msg',
      `categoryName is invalid of 'categoryName' at body location.`,
    );
    expect(response.body).toHaveProperty('errors');
  });

  it('Should get error of incorrect categoryId whlie editing a category sucessfully', async function () {
    const categoryObj = {
      categoryName: 'nut bolt',
    };
    const categoryId1 = '629e02d9ef765441783a3cc5';
    const response = await request(app)
      .patch(`/categories/${categoryId1}`)
      .send(categoryObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('msg', `Category Not Found`);
  });

  it('Test case to get category by ID', async function () {
    const response = await request(app)
      .get(`/categories/${categoryId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      `Categories Fetched Successfully`,
    );
    expect(response.body).toHaveProperty('record');
    expect(response.body.record).toHaveProperty('_id', categoryId);
    expect(response.body.record).toHaveProperty('categoryName', 'nut bolt');
    expect(response.body.record).toHaveProperty('categoryStatus', 'active');
  });

  it('Should get error of incorrect categoryId whlie getting a category by id', async function () {
    const categoryId1 = '629e02d9ef765441783a3cc5';
    const response = await request(app)
      .get(`/categories/${categoryId1}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('msg', `Category Not Found`);
  });

  it('Test case to delete category by ID', async function () {
    const response = await request(app)
      .delete(`/categories/${categoryId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      'Category Deleted Successfully.',
    );
  });

  it('Should get error of incorrect categoryId whlie deleting a category by id', async function () {
    const categoryId1 = '629e02d9ef765441783a3cc5';
    const response = await request(app)
      .delete(`/categories/${categoryId1}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('msg', `Category Not Found`);
  });

  it('Test case to get all categories', async function () {
    const response = await request(app)
      .get('/categories?limit=10&page=1&sortDirection=desc')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      'Categories fetched successfully.',
    );
    expect(response.body).toHaveProperty('records');
    expect(response.body).toHaveProperty('records.docs');
    expect(response.body.records.docs[0]).toHaveProperty(
      '_id',
      '62e9adf4030a270999ca9448',
    );
    expect(response.body.records.docs[0]).toHaveProperty(
      'categoryName',
      'engine',
    );
    expect(response.body.records.docs[0]).toHaveProperty(
      'categoryStatus',
      'active',
    );
    expect(response.body).toHaveProperty('records.limit', 10);
    expect(response.body).toHaveProperty('records.total', 2);
    expect(response.body).toHaveProperty('records.page', 1);
    expect(response.body).toHaveProperty('records.pages', 1);
  });
});
