const { validationResult } = require('express-validator');

const Util = require('../helpers/util.helper');
const JWT = require('../helpers/jwt.helper');
const UserToken = require('../models/userToken.model');
const mongoose = require('mongoose');
const errorName = require('../constants/messages.constant').ERROR_NAME

async function generateResult(
  ret,
  res,
  manyMode,
  next,
  message,
  statusCode = 401,
  error = null,
) {
  if (ret) {
    if (!manyMode) {
      return next();
    } else {
      return true;
    }
  } else if (!manyMode) {
    const msgError =
      !error || !error.length
        ? { success: false, statusCode: statusCode, errorName: errorName.__UNAUTHENTICATED_USER, errorMsg: message }
        : {
          success: false,
          statusCode: statusCode,
          errorName: errorName.__VALIDATION_ERROR,
          errorMsg: error
        };
    Util.render(res, msgError);
  }
  return false;
}

module.exports.checkValidation = function (modes) {
  return async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msgString = `${errors.array()[0].msg} at ${errors.array()[0].location
        } location.`;
      return res
        .status(400)
        .json({ success: false, errorName: errorName.__VALIDATION_ERROR, errorMsg: errors.array() });
    } else {
      next();
    }
  };
};

module.exports.authentication = function (modes) {
  return async function (req, res, next, manyMode = false) {
    try {
      const token = await JWT.getRequestToken(req);
      if (token) {
        const jwtData = await JWT.jwtVerify(req);
        if (jwtData) {
          const aggregate = [
            {
              $match: {
                token: token,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $project: {
                user: 1,
                _id: 0,
              },
            },
          ];
          const userData = await UserToken.aggregate(aggregate);
          if (
            userData &&
            userData.length &&
            userData[0].user &&
            userData[0].user.length
          ) {
            req.userData = userData[0].user[0];
            return generateResult(true, res, manyMode, next);
          } else {
            return generateResult(
              false,
              res,
              manyMode,
              next,
              'User not authenticated.',
              401,
            );
          }
        }
      } else {
        return generateResult(
          false,
          res,
          manyMode,
          next,
          'User not authenticated.',
          401,
        );
      }
    } catch (error) {
      return generateResult(
        false,
        res,
        manyMode,
        next,
        'User not authenticated.',
        401,
      );
    }
  };
};

module.exports.checkDuplicates = function (model, keys) {
  return async function (req, res, next, manyMode = false) {
    try {
      let isDuplicate = false;
      let key = '';
      for (let i = 0; i < keys.length; i++) {
        const element = keys[i];
        const dbData = await model.findOne({ [element]: req.body[element] });
        if (dbData) {
          isDuplicate = true;
          key = element;
          break;
        }
      }
      if (isDuplicate && key) {
        const error = [
          {
            msg: `${key} is duplicate`,
            param: key,
            location: 'body',
          },
        ];
        return generateResult(
          false,
          res,
          manyMode,
          next,
          `${key} is duplicate at body location.`,
          400,
          error,
        );
      } else {
        return generateResult(true, res, manyMode, next);
      }
    } catch (error) {
      return generateResult(
        false,
        res,
        manyMode,
        next,
        'check duplicate error',
        400,
      );
    }
  };
};
