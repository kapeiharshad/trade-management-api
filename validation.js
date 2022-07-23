const { check } = require('express-validator');
const ObjectID = require('mongodb').ObjectID;
const {
  checkValidation,
  authentication,
  checkDuplicates,
} = require('./middlewares/customValidation.middleware');
const User = require('./models/users.model');

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
  check('token')
    .isString()
    .withMessage('must be a valid string')
    .isLength({ min: 1 })
    .optional(),
  checkValidation(),
];
