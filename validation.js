const { check } = require('express-validator');
const ObjectID = require('mongodb').ObjectID;
const checkValidation = require('./middlewares/validation.middleware');

exports.addUser = [
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
  check('password', 'password is invalid').isString(),
  check('userType', 'userType is invalid').isString().optional(),
  check('status', 'status is invalid').isString().optional(),
  checkValidation(),
];

exports.editUser = [
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
  check('userId').custom(value => {
    if (ObjectID.isValid(value)) {
      return value;
    } else {
      throw new Error('Invalid objectId');
    }
  }),
  checkValidation(),
];
