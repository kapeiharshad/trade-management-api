const uniqueId = require('generate-unique-id');
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
  static generateNanoId(useLetter) {
    let letterAllowed = false;

    if (useLetter) {
      letterAllowed = true;
    }

    return uniqueId({
      length: 12,
      useLetters: letterAllowed,
    });
  }
}
module.exports = Util;
