const User = require('../models/users.model');
const UserToken = require('../models/userToken.model');
const logger = require('../helpers/logger.helper');

const mongoose = require('mongoose');
const JWT = require('../helpers/jwt.helper');
const bcrypt = require('bcryptjs');
const moment = require('moment');

class AuthService {
  static async login(email, password) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return {
          success: false,
          statusCode: 401,
          msg: 'Email or password is incorrect!',
        };
      }
      const isPasswordSame = await bcrypt.compare(password, user.password);
      if (isPasswordSame) {
        const token = await JWT.jwtSign({ id: user.id });
        const expiryTime = moment()
          .add({ days: process.env.JWT_TOKEN_EXPIRE_IN_DAY })
          .toDate();
        const saveUserToken = await UserToken.updateOne(
          { userId: mongoose.Types.ObjectId(user._id), type: 'accessToken' },
          {
            $set: {
              userId: mongoose.Types.ObjectId(user._id),
              token: token,
              expiryTime: expiryTime,
              type: 'accessToken',
            },
          },
          { upsert: true },
        );
        if (
          saveUserToken &&
          (saveUserToken.modifiedCount || saveUserToken.upsertedCount)
        ) {
          return {
            success: true,
            token: token,
          };
        } else {
          throw new Error('Error while saving user token');
        }
      }
      return {
        success: false,
        statusCode: 401,
        msg: 'Email or password is incorrect!',
      };
    } catch (error) {
      logger.error('From login api error', { errorMsg: error });
      return {
        success: false,
        msg: error,
      };
    }
  }
}
module.exports = AuthService;
