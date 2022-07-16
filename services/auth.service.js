const User = require('../models/users.model');
const UserToken = require('../models/userToken.model');
const logger = require('../helpers/logger.helper');
const Mailer = require('../helpers/mailer.helper');
const EmailTemplate = require('../models/emailTemplate');

const mongoose = require('mongoose');
const JWT = require('../helpers/jwt.helper');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const crypto = require('crypto');
const Mustache = require('mustache');
const path = require('path');

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
        msg: 'An error occurs',
      };
    }
  }

  static async changePassword(userData, oldPassword, newPassword) {
    try {
      const user = await User.findOne({
        _id: mongoose.Types.ObjectId(userData._id),
      });
      const isPasswordSame = await bcrypt.compare(oldPassword, user.password);
      if (isPasswordSame) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newPassword, salt);
        const updatePassword = await User.updateOne(
          { _id: mongoose.Types.ObjectId(user._id) },
          { password: hash },
        );
        if (updatePassword && updatePassword.modifiedCount) {
          return {
            success: true,
            msg: 'Password changed successfully',
          };
        } else {
          throw new Error('Error while updating user password.');
        }
      }
      return {
        success: false,
        statusCode: 400,
        msg: "Entered password's didn't matched.",
      };
    } catch (error) {
      logger.error('From changePassword api error', { errorMsg: error });
      return {
        success: false,
        msg: 'An error occurs',
      };
    }
  }

  static async forgotPassword({ body }) {
    try {
      const baseUrl = '';
      const userData = await User.findOne({ email: body.email });
      if (userData) {
        const buf = crypto.randomBytes(48);
        const randToken = buf.toString('hex');
        const expiryTime = moment()
          .add({ days: process.env.JWT_TOKEN_EXPIRE_IN_DAY })
          .toDate();
        const saveUserToken = await UserToken.updateOne(
          { userId: mongoose.Types.ObjectId(userData._id), type: 'randToken' },
          {
            $set: {
              userId: mongoose.Types.ObjectId(userData._id),
              token: randToken,
              expiryTime: expiryTime,
              type: 'randToken',
            },
          },
          { upsert: true },
        );
        if (
          saveUserToken &&
          (saveUserToken.modifiedCount || saveUserToken.upsertedCount)
        ) {
          const emailTemplate = await EmailTemplate.findOne({
            type: 'forgotPassword',
          });
          const view = {
            Url: `${baseUrl}/reset-password/${randToken}`,
            Name: userData.userName || '',
            currentYear: new Date().getFullYear(),
          };
          const emailBody = Mustache.render(emailTemplate.description, view);
          let mailData = {
            message: {
              to: body.email,
              attachments: [
                {
                  filename: 'logo.jpg',
                  path: './templates/images/logo.jpg',
                  cid: 'logo.jpg',
                },
              ],
            },
            template: path.join(
              __dirname,
              '..',
              'templates',
              'emails',
              'forgotEmailTemplate',
            ),
            locals: {
              emailBody,
              subject: emailTemplate.subject,
            },
          };
          new Promise(async () => {
            await Mailer.sendEmail(mailData);
          });
          return {
            success: true,
            msg:
              'The reset password link has been sent to your email address successfully',
          };
        } else {
          throw new Error('Error while saving user token');
        }
      } else {
        return {
          success: false,
          statusCode: 400,
          msg: 'The Email is not registered with us',
        };
      }
    } catch (error) {
      logger.error('From forgotPassword api error', { errorMsg: error });
      return {
        success: false,
        msg: error,
      };
    }
  }

  static async resetPasswordVerify({ body }) {
    try {
      const userToken = await UserToken.findOne({
        type: 'randToken',
        token: body.token,
      });
      if (userToken && userToken.expiryTime > Date.now()) {
        return {
          success: true,
          msg: 'Link verified successfully',
        };
      } else {
        return {
          success: false,
          statusCode: 400,
          msg: 'Link verified unsuccessfully',
        };
      }
    } catch (error) {
      logger.error('From resetPasswordVerify api error', { errorMsg: error });
      return {
        success: false,
        msg: 'An error occurs',
      };
    }
  }

  static async resetPassword({ body }) {
    try {
      const userToken = await UserToken.findOne({
        type: 'randToken',
        token: body.token,
      });
      if (userToken && userToken.expiryTime > Date.now()) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(body.newPassword, salt);
        const updatePassword = await User.updateOne(
          { _id: mongoose.Types.ObjectId(userToken.userId) },
          { password: hash },
        );
        if (updatePassword && updatePassword.modifiedCount) {
          new Promise(async () => {
            await UserToken.deleteOne({ type: 'randToken', token: body.token });
          });
          return {
            success: true,
            msg: 'Password reset successfully',
          };
        } else {
          throw new Error('Error while reseting user password.');
        }
      } else {
        return {
          success: false,
          statusCode: 400,
          msg: 'Reset password unsuccessfully',
        };
      }
    } catch (error) {
      logger.error('From resetPassword api error', { errorMsg: error });
      return {
        success: false,
        msg: 'An error occurs',
      };
    }
  }

  static async logout(headerToken, body) {
    try {
      if (!headerToken && body && !body.token) {
        return {
          success: false,
          statusCode: 400,
          msg: 'Must contains token on request body or header',
        };
      }
      await UserToken.deleteMany({ token: headerToken });
      if (body.hasOwnProperty('token')) {
        await UserToken.deleteMany({ token: body.token });
      }
      return {
        success: true,
        msg: 'Logout successfully',
      };
    } catch (error) {
      logger.error('From logout api error', { errorMsg: error });
      return {
        success: false,
        msg: 'An error occurs',
      };
    }
  }
}
module.exports = AuthService;
