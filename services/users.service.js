const User = require('../models/users.model');
const logger = require('../helpers/logger');
class UserService {
  static async addUser({ body }) {
    try {
      const saveObj = {
        userName: body.userName,
        contact: body.contact,
        email: body.email,
        password: body.password,
      };
      if (body.firstName) {
        saveObj.firstName = body.firstName;
      }
      if (body.lastName) {
        saveObj.lastName = body.lastName;
      }
      if (body.gender) {
        saveObj.gender = body.gender;
      }
      if (body.userType) {
        saveObj.userType = body.userType;
      }
      if (body.status) {
        saveObj.status = body.status;
      }
      const userData = await User.create(saveObj);
      if (userData && userData.id) {
        return {
          success: true,
          statusCode: 200,
          msg: 'User added successfully.',
          id: userData.id,
        };
      } else {
        return {
          success: false,
          statusCode: 400,
          msg: 'User added unsuccessfully.',
        };
      }
    } catch (error) {
      logger.error('From Add user error', { errorMsg: error });
      return {
        success: false,
        statusCode: 500,
        msg: 'An error occurs',
      };
    }
  }

  static async editUser({ body, params }) {
    try {
      const editObj = {};
      if (body.userName) {
        editObj.userName = body.userName;
      }
      if (body.contact) {
        editObj.contact = body.contact;
      }
      if (body.email) {
        editObj.email = body.email;
      }
      if (body.password) {
        editObj.password = body.password;
      }
      if (body.firstName) {
        editObj.firstName = body.firstName;
      }
      if (body.lastName) {
        editObj.lastName = body.lastName;
      }
      if (body.gender) {
        editObj.gender = body.gender;
      }
      if (body.userType) {
        editObj.userType = body.userType;
      }
      if (body.status) {
        editObj.status = body.status;
      }
      const userData = await User.updateOne({ _id: params.userId }, editObj);
      if (userData && userData.modifiedCount) {
        return {
          success: true,
          statusCode: 200,
          msg: 'User edited successfully.',
        };
      } else {
        return {
          success: false,
          statusCode: 400,
          msg: 'User not founded or no content to modify.',
        };
      }
    } catch (error) {
      logger.error('From edit user error', { errorMsg: error });
      return {
        success: false,
        statusCode: 500,
        msg: 'An error occurs',
      };
    }
  }

  static async getUser({ body }) {}
}
module.exports = UserService;
