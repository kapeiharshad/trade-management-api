const app = require('../app');
const request = require('supertest');
const { setupDB } = require('./test-config/testSetup');
setupDB(true);
describe(`Product API's test cases`, function () {
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

  it('Test case to create a product successfully', async function () {
    const productObj = {
      categoryId: '62e9adf4030a270999ca9448',
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
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', 'Product Created Successfully');
    expect(response.body).toHaveProperty('id');
    productId = response.body.id;
  });

  it('Test case to pass inavlid categoryId  while creating a product', async function () {
    const productObj = {
      categoryId: '62e9adf4030a270999ca9447',
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
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty(
      'msg',
      'Category Does Not Exist,Cannot Create Product Of It',
    );
  });

  it('Test case to pass inactive categoryId while creating a product', async function () {
    const productObj = {
      categoryId: '62e9adf4030a270999ca9447',
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
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty(
      'msg',
      'Category Does Not Exist,Cannot Create Product Of It',
    );
  });

  it('Test case to update a product successfully', async function () {
    const productObj = {
      categoryId: '62e9adf4030a270999ca9448',
      productName: 'mrf tyre',
      actualAmount: 10,
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
      .patch(`/products/62dbfaf07e7ccb28caf17d95`)
      .send(productObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', 'Product Updated Successfully');
  });

  it('Test case to pass inactive categoryId while editing a product', async function () {
    const productObj = {
      categoryId: '62e9adf4030a270999ca9447',
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
      .patch('/products/62dbfaf07e7ccb28caf17d95')
      .send(productObj)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty(
      'msg',
      'Category Does Not Exist,Cannot Edit Product Of It',
    );
  });

  it('Test case to get product by ID', async function () {
    const response = await request(app)
      .get(`/products/${productId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('msg', `Product Fetched Successfully`);
    expect(response.body).toHaveProperty('record');
    expect(response.body.record).toHaveProperty('_id', productId);
    expect(response.body.record).toHaveProperty(
      'categoryId',
      '62e9adf4030a270999ca9448',
    );
    expect(response.body.record).toHaveProperty('productName', 'mrf tyre');
    expect(response.body.record).toHaveProperty('actualAmount', 1000);
    expect(response.body.record).toHaveProperty(
      'specification',
      'one of the best tyre in 2022',
    );
    expect(response.body.record).toHaveProperty('discount', 0);
    expect(response.body.record).toHaveProperty('productImage', [
      { sequence: '123', val: '12' },
    ]);
    expect(response.body.record).toHaveProperty('productStatus', 'active');
  });

  it('Should get error of product not found whlie passing invalid productId for getting a product by id', async function () {
    const response = await request(app)
      .get(`/products/62e9adf4030a270999ca9448`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('msg', `Product Not Found`);
  });

  it('Test case to delete product by invalid ID', async function () {
    const response = await request(app)
      .delete(`/products/jnbvkjbvkrbkvverbvv`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty(
      'msg',
      `Invalid objectId of 'productId' at params location.`,
    );
  });

  it('Test case to delete product by ID', async function () {
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      `Product Deleted Successfully.`,
    );
  });

  it('Test case to get all products', async function () {
    const response = await request(app)
      .get(`/products?limit=10&page=1&sortDirection=desc`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty(
      'msg',
      `Products fetched successfully.`,
    );
    expect(response.body).toHaveProperty('records');
    expect(response.body).toHaveProperty('records.docs');
    expect(response.body.records.docs[1]).toHaveProperty(
      '_id',
      '62dbfaf07e7ccb28caf17d95',
    );

    expect(response.body.records.docs[1]).toHaveProperty(
      'categoryId',
      '62e9adf4030a270999ca9448',
    );
    expect(response.body.records.docs[1]).toHaveProperty(
      'productName',
      'mrf tyre',
    );
    expect(response.body.records.docs[1]).toHaveProperty('actualAmount', 10);
    expect(response.body.records.docs[1]).toHaveProperty(
      'specification',
      'one of the best tyre in 2022',
    );
    expect(response.body.records.docs[1]).toHaveProperty('discount', 0);
    expect(response.body.records.docs[1]).toHaveProperty('productImage', [
      { sequence: '123', val: '12' },
    ]);
    expect(response.body.records.docs[1]).toHaveProperty(
      'productStatus',
      'active',
    );
    expect(response.body).toHaveProperty('records.limit', 10);
    expect(response.body).toHaveProperty('records.total', 3);
    expect(response.body).toHaveProperty('records.page', 1);
    expect(response.body).toHaveProperty('records.pages', 1);
  });
});
