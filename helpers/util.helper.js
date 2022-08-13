const { v4: uuidv4 } = require('uuid');
const errorName = require('../constants/messages.constant').ERROR_NAME;
class Util {
  static render(res, result) {
    if (!result.success) {
      if (result.statusCode) {
        res.status(result.statusCode);
        delete result.statusCode;
      } else res.status(400);

      if (
        result &&
        result.errorMsg &&
        result.errorName &&
        result.errorName != errorName.__VALIDATION_ERROR
      ) {
        result['errors'] = [
          {
            msg: result.errorMsg,
            location: 'internal',
          },
        ];
      } else {
        result['errors'] = result.errorMsg;
      }
      delete result.errorMsg;
    } else {
      if (result.statusCode) {
        res.status(result.statusCode);
        delete result.statusCode;
      } else res.status(200);
    }

    res.json(result);
  }
  static generateUUID() {
    return uuidv4();
  }
}
module.exports = Util;
