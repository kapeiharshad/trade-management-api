const User = require('../models/users.model');
const logger = require('../helpers/logger.helper');
const mongoose = require('mongoose');
const JWT = require('../helpers/jwt.helper');
const bcrypt = require('bcryptjs');

class AuthService {
  static async login(email, password) {
    console.log('from email::', email);
    try {
      const user = await User.findOne({ email: email });
      console.log('from user:::', user);
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
        console.log('from token:::', token);
      }
      return 'login';
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
