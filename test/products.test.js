const app = require('../app');
const request = require('supertest');
const { setupDB } = require('./test-config/testSetup');
setupDB(true);
describe(`Category API's test cases`, function () {
  let adminToken = '',
    productId = '';
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

  it('Test case to create a product sucessfully', async function () {
    const productObj = {
      categoryId: '62e9ab8a1642afc55e18ecf6',
      productName: 'mrf tyre',
      actualAmount: 1000,
      productImage: [
        {
          val: '12',
          sequence: 123,
        },
      ],
      specification: 'one of the best tyre in 2022',
      discount: 0,
    };
    const response = await request(app)
      .post('/products/')
      .send(productObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    // console.log('response ', resfileContents fileContentsponse.body);`
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', 'Product Created Sucessfully');
    expect(response.body).toHaveProperty('id');
    productId = response.body.id;
  });
  // it('Test case to get product by ID', async function () {
  //   const response = await request(app)
  //     .get(`/categories/${categoryId}`)
  //     .set('Accept', 'application/json')
  //     .set('Authorization', 'Bearer ' + adminToken);
  //   expect(response.status).toEqual(200);
  //   expect(response.body).toHaveProperty('success', true);
  //   expect(response.body).toHaveProperty('msg', `User fetched successfully.`);
  //   expect(response.body).toHaveProperty('record');
  //   expect(response.body.record).toHaveProperty('_id', userId);
  //   expect(response.body.record).toHaveProperty('firstName', 'kailash kumar');
  //   expect(response.body.record).toHaveProperty('lastName', 'Yadav');
  //   expect(response.body.record).toHaveProperty('userName', 'kailash111');
  //   expect(response.body.record).toHaveProperty('contact', '9782561655');
  //   expect(response.body.record).toHaveProperty('gender', 'Male');
  //   expect(response.body.record).toHaveProperty(
  //     'email',
  //     'kailash111@yopmail.com',
  //   );
  //   expect(response.body.record).toHaveProperty('userType', 'user');
  //   expect(response.body.record).toHaveProperty('status', 'active');
  // });

  // it('Test case to delete product by ID', async function () {
  //   const response = await request(app)
  //     .delete(`/users/${userId}`)
  //     .set('Accept', 'application/json')
  //     .set('Authorization', 'Bearer ' + adminToken);
  //   expect(response.status).toEqual(200);
  //   expect(response.body).toHaveProperty('success', true);
  //   expect(response.body).toHaveProperty('msg', `User deleted successfully.`);
  // });
});
