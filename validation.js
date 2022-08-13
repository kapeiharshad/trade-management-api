const { check } = require('express-validator');
const ObjectID = require('mongodb').ObjectID;
const {
  checkValidation,
  authentication,
  checkDuplicates,
} = require('./middlewares/customValidation.middleware');
const User = require('./models/user.model');

exports.addUser = [
  authentication(),
  check('userName', 'userName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters'),
  check('firstName', 'firstName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters')
    .optional(),
  check('lastName', 'lastName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters')
    .optional(),
  check('contact', 'contact is invalid')
    .isString()
    .isLength({ min: 10, max: 10 })
    .withMessage('length should be 10 characters'),
  check('gender', 'gender is invalid').isString().optional(),
  check('email', 'email is invalid').isEmail(),
  check('password', 'password is invalid').isString().isLength({ min: 8 }),
  check('userType', 'userType is invalid').isString().optional(),
  check('status', 'status is invalid').isString().optional(),
  checkDuplicates(User, ['userName', 'contact', 'email']),
  checkValidation(),
];

exports.editUser = [
  authentication(),
  check('userId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  check('userName', 'userName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters')
    .optional(),
  check('firstName', 'firstName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters')
    .optional(),
  check('lastName', 'lastName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters')
    .optional(),
  check('contact', 'contact is invalid')
    .isString()
    .isLength({ min: 10, max: 10 })
    .withMessage('length should be 10 characters')
    .optional(),
  check('gender', 'gender is invalid').isString().optional(),
  check('email', 'email is invalid').isEmail().optional(),
  check('password', 'password is invalid').isString().optional(),
  check('userType', 'userType is invalid').isString().optional(),
  check('status', 'status is invalid').isString().optional(),
  checkValidation(),
];

exports.getUser = [
  authentication(),
  check('limit')
    .matches(/^\d+$/)
    .withMessage('must contain a whole number')
    .optional(),
  check('page')
    .matches(/^\d+$/)
    .withMessage('must contain a whole number')
    .optional(),
  check('sortDirection')
    .custom(value => {
      const splitArray = value.split(',');
      splitArray.forEach(element => {
        if (element !== 'asc' && element !== 'desc') {
          throw new Error('Value must be "asc" or "desc" with "," seperate');
        }
      });
      return value;
    })
    .optional(),
  checkValidation(),
];

exports.getUserById = [
  authentication(),
  check('userId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  checkValidation(),
];

exports.deleteUser = [
  authentication(),
  check('userId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  checkValidation(),
];

exports.login = [
  check('email').isEmail().withMessage('must be a valid email'),
  check('password')
    .isString()
    .isLength({ min: 1 })
    .withMessage('must be a valid string'),
  checkValidation(),
];

exports.changePassword = [
  authentication(),
  check('oldPassword')
    .isString()
    .withMessage('must be a valid string')
    .isLength({ min: 8 })
    .withMessage('must be a atleast 8 character length'),
  check('newPassword')
    .isString()
    .withMessage('must be a valid string')
    .isLength({ min: 8 })
    .withMessage('must be a atleast 8 character length'),
  checkValidation(),
];

exports.forgotPassword = [
  check('email').isEmail().withMessage('must be a valid email'),
  checkValidation(),
];

exports.resetPasswordVerify = [
  check('token')
    .isString()
    .withMessage('must be a valid string')
    .isLength({ min: 1 })
    .withMessage('token on body must not be empty'),
  checkValidation(),
];

exports.resetPassword = [
  check('token')
    .isString()
    .withMessage('must be a valid string')
    .isLength({ min: 1 })
    .withMessage('token on body must not be empty'),
  check('newPassword', 'Max 15 characters are allowed').isLength({ min: 8 }),
  checkValidation(),
];

exports.logoutValidation = [
  authentication(),
  check('token')
    .isString()
    .withMessage('must be a valid string')
    .isLength({ min: 1 })
    .optional(),
  checkValidation(),
];

exports.createCategory = [
  authentication(),
  check('categoryName', 'categoryName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters'),
  check('categoryStatus', 'categoryStatus is invalid')
    .isString()
    .isLength({ min: 6, max: 8 })
    .optional(),
  checkValidation(),
];

exports.editCategory = [
  authentication(),
  check('categoryId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  check('categoryName', 'categoryName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters'),
  checkValidation(),
];

exports.getCategory = [
  authentication(),
  check('categoryId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  checkValidation(),
];

exports.createProduct = [
  authentication(),
  check('categoryId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  check('productImage')
    .isArray()
    .withMessage('productImage can not be empty and must be an array!'),
  check('productImage').custom(async value => {
    if (value == undefined || !value.length) {
      throw new Error('productImage can not be empty and must be an array!');
    } else {
      value.forEach(singleImage => {
        if (!singleImage.val || typeof singleImage.val != 'string') {
          throw new Error('Product Images Are Not Valid');
        } else if (
          !singleImage.sequence ||
          typeof singleImage.sequence != 'number'
        ) {
          throw new Error('Sequence Is Valid');
        }
      });
    }
  }),
  check('productName', 'productName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters'),
  check('specification', 'specification is invalid').isString(),
  check('actualAmount')
    .matches(/^\d+$/)
    .withMessage('must contain a whole number'),
  check('discount')
    .matches(/^\d+$/)
    .withMessage('must contain a whole number')
    .optional(),
  check('productStatus', 'productStatus is invalid')
    .isString()
    .isLength({ min: 6, max: 8 })
    .optional(),
  checkValidation(),
];

exports.editProduct = [
  authentication(),
  check('productId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  check('categoryId')
    .custom(value => {
      if (ObjectID.isValid(value)) {
        return value;
      } else {
        throw new Error('Invalid objectId');
      }
    })
    .optional(),
  check('productImage')
    .isArray()
    .withMessage('productImage can not be empty and must be an array!'),
  check('productImage').custom(async value => {
    if (value == undefined || !value.length) {
      throw new Error('productImage can not be empty and must be an array!');
    } else {
      value.forEach(singleImage => {
        if (!singleImage.val || typeof singleImage.val != 'string') {
          throw new Error('Product Images Are Not Valid');
        } else if (
          !singleImage.sequence ||
          typeof singleImage.sequence != 'number'
        ) {
          throw new Error('Sequence Is Valid');
        }
      });
    }
  }),
  check('productName', 'productName is invalid')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('length should be between 1 to 100 characters')
    .optional(),
  check('specification', 'specification is invalid').isString().optional(),
  check('actualAmount')
    .matches(/^\d+$/)
    .withMessage('must contain a whole number')
    .optional(),
  check('discount')
    .matches(/^\d+$/)
    .withMessage('must contain a whole number')
    .optional(),
  checkValidation(),
];

exports.getProduct = [
  authentication(),
  check('productId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  checkValidation(),
];
exports.addToCart = [authentication()];
