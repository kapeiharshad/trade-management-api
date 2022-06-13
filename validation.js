const { check } = require('express-validator');
const checkValidation = require('./middlewares/validation.middleware');

exports.addUser = [
  check('name', 'Name is invalid').isString().isLength({ min: 1, max: 100 }),

  checkValidation(),
];

exports.createCategory = [
  check('categoryName', 'categoryName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters'),

  check('categoryStatus', 'categoryStatus is invalid').isString().optional(),

  checkValidation(),
];

exports.editCategory = [
  check('categoryId').custom(value => {
    if (ObjectId.isValid(value)) {
      return value;
    }
    throw new Error('Invalid ObjectId');
  }),

  check('categoryName', 'categoryName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters')
    .optional(),

  check('categoryStatus', 'categoryStatus is invalid').isString().optional(),

  checkValidation(),
];

exports.getCategory = [
  check('categoryId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),

  checkValidation(),
];

exports.getAllPaginatedCategories = [
  check('page', 'page number is invalid')
    .isNumber()
    .withMessage('page number should be in number'),

  check('limit', 'limit is invalid')
    .isNumber()
    .withMessage('limit should be in number'),

  checkValidation(),
];
