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
  static calculateProductValueWithDiscountInRuppee(
    productAmount,
    discount,
    quantity,
  ) {
    if (discount) {
      const discountValueInRuppee = (discount * productAmount) / 100;
      return (productAmount - discountValueInRuppee) * quantity;
    }
    return productAmount * quantity;
  }
  static productCategoryPopulateObject() {
    return {
      path: 'productId',
      populate: {
        path: 'categoryId',
        select: '-createdAt -updatedAt -categoryUniqueId -__v',
        model: 'Category',
      },
      select: '-createdAt -updatedAt -productUniqueId -__v',
      model: 'Product',
    };
  }
}
module.exports = Util;
