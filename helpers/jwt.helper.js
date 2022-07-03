const jwt = require('jsonwebtoken');

class JWT {
  static async jwtSign(payload, secret = null, expiry = null) {
    expiry = process.env.JWT_TOKEN_EXPIRE_IN_HOURS
      ? process.env.JWT_TOKEN_EXPIRE_IN_HOURS
      : '';
    secret = process.env.JWT_TOKEN_SECRET ? process.env.JWT_TOKEN_SECRET : '';
    if (!expiry || !secret) {
      return false;
    }
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static async getRequestToken(req) {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    return token;
  }

  static async jwtVerify(req, secret = null) {
    secret = process.env.JWT_TOKEN_SECRET ? process.env.JWT_TOKEN_SECRET : '';
    if (secret) {
      const token = JWT.getRequestToken(req);
      if (token) {
        return jwt.verify(token, secret);
      }
    }
    return false;
  }

  static async jwtDecode(req) {
    const token = JWT.getRequestToken(req);
    if (token) {
      return jwt.decode(token, { json: true });
    }
    return false;
  }
}

module.exports = JWT;
