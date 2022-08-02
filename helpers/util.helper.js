const { v4: uuidv4 } = require('uuid');
class Util {
  static render(res, result) {
    if (!result.success) {
      if (result.statusCode) {
        res.status(result.statusCode);
        delete result.statusCode;
      } else res.status(400);
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
