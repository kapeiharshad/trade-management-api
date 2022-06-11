const User = require('../models/users.model');
const logger = require('../helpers/logger');
const pagination = require('../helpers/pagination');
const mongoose = require('mongoose');
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
      const userData = await User.updateOne(
        { _id: mongoose.Types.ObjectId(params.userId) },
        editObj,
      );
      if (userData && userData.modifiedCount) {
        return {
          success: true,
          statusCode: 200,
          msg: 'User edited successfully.',
        };
      } else {
        return {
          success: false,
          statusCode: 404,
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

  static async getUser({ query }) {
    try {
      const projection = {
        // userName: 1,
        // firstName: 1,
        // lastName: 1,
      };
      const paginationObj = new pagination();
      const docs = await paginationObj.generatePagination(
        User,
        query,
        projection,
      );
      return {
        success: true,
        statusCode: 200,
        msg: 'Users fetched successfully.',
        records: docs,
      };
    } catch (error) {
      logger.error('From getUser error', { errorMsg: error });
      return {
        success: false,
        statusCode: 500,
        msg: 'An error occurs',
      };
    }
  }

  static async getUserById({ params }) {
    try {
      const userData = await User.findOne({
        _id: mongoose.Types.ObjectId(params.userId),
        status: 'active',
      });
      if (userData) {
        return {
          success: true,
          statusCode: 200,
          msg: 'User fetched successfully.',
          record: userData,
        };
      } else {
        return {
          success: false,
          statusCode: 404,
          msg: 'User not founded.',
        };
      }
    } catch (error) {
      logger.error('From getUser error', { errorMsg: error });
      return {
        success: false,
        statusCode: 500,
        msg: 'An error occurs',
      };
    }
  }

  static async deleteUser({ params }) {
    try {
      const deletedData = await User.updateOne(
        { _id: mongoose.Types.ObjectId(params.userId) },
        { status: 'inactive' },
      );
      if (deletedData && deletedData.modifiedCount) {
        return {
          success: true,
          statusCode: 200,
          msg: 'User deleted successfully.',
        };
      } else {
        return {
          success: false,
          statusCode: 404,
          msg: 'User not founded or deleted unsuccessfully.',
        };
      }
    } catch (error) {
      logger.error('From deleteUser error', { errorMsg: error });
      return {
        success: false,
        statusCode: 500,
        msg: 'An error occurs',
      };
    }
  }
}
module.exports = UserService;
