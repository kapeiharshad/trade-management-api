const mongoose = require('mongoose');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const logger = require('../helpers/logger.helper');
const { isEqual, sumBy } = require('lodash');
const Util = require('../helpers/util.helper');
const errorName = require('../constants/messages.constant').ERROR_NAME;
class CartService {
  static async addToCart({ body, userData }) {
    try {
      const [cartData, productData] = await Promise.all([
        Cart.findOne(
          {
            productId: mongoose.Types.ObjectId(body.productId),
            userId: mongoose.Types.ObjectId(userData._id),
          },
          { _id: 1 },
        ),
        Product.findOne(
          { _id: mongoose.Types.ObjectId(body.productId) },
          { productStatus: 1, productOutOfStock: 1 },
        ),
      ]);

      if (
        !productData ||
        !productData._id ||
        !productData.productStatus ||
        (productData &&
          ((productData.productStatus &&
            productData.productStatus != 'active') ||
            productData.productOutOfStock))
      )
        return {
          statusCode: 400,
          success: false,
          errorName: errorName.__FAILED_EXECUTION,
          errorMsg: 'Product Is Not Available For Adding In Cart',
        };

      if (cartData && cartData._id)
        return {
          success: false,
          statusCode: 400,
          errorName: errorName.__FAILED_EXECUTION,
          errorMsg: 'This Product Is Already In Your Cart',
        };

      const saveObj = {
        productId: mongoose.Types.ObjectId(body.productId),
        userId: mongoose.Types.ObjectId(userData._id),
        quantity: body && body.quantity >= 1 ? body.quantity : 1,
      };

      const saveOutput = await Cart.create(saveObj);
      if (saveOutput && saveOutput._id)
        return {
          success: true,
          statusCode: 200,
          msg: 'Product Added In Cart Successfully',
          id: saveOutput.id,
        };

      return {
        success: false,
        statusCode: 400,
        errorName: errorName.__FAILED_EXECUTION,
        errorMsg: 'Failed To Add Product In Cart',
      };
    } catch (error) {
      logger.error('From add to cart error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        errorName: errorName.__INTERNAL_SERVER_ERROR,
        errorMsg: 'An Error Occured While Adding Product In Cart',
      };
    }
  }

  static async getOneCart({ params }) {
    try {
      const cartData = await Cart.findOne({
        _id: mongoose.Types.ObjectId(params.cartId),
      })
        .lean()
        .populate(Util.productCategoryPopulateObject());
      console.log(' cartData cartData', cartData);
      if (cartData && cartData._id) {
        if (cartData.productId && cartData.productId.actualAmount) {
          cartData.cartValueWithoutDiscount =
            cartData.productId.actualAmount * cartData.quantity;
          cartData.cartValueWithDiscount =
            Util.calculateProductValueWithDiscountInRuppee(
              cartData.productId.actualAmount,
              cartData.productId.discount,
              cartData.quantity,
            );
        }

        return {
          statusCode: 200,
          success: true,
          record: cartData,
          msg: 'Cart Data Fetched Successfully',
        };
      }

      return {
        statusCode: 400,
        success: false,
        errorName: errorName.__FAILED_EXECUTION,
        errorMsg: 'No Data Found In Cart',
      };
    } catch (error) {
      logger.error('From get one cart error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        errorName: errorName.__INTERNAL_SERVER_ERROR,
        errorMsg: 'An Error Occured While Getting Product From Cart',
      };
    }
  }

  static async removeProductByCartId({ params, userData }) {
    try {
      const cartData = await Cart.findOne({
        _id: mongoose.Types.ObjectId(params.cartId),
      });

      if (!cartData || !cartData._id)
        return {
          statusCode: 400,
          success: false,
          errorName: errorName.__FAILED_EXECUTION,
          errorMsg: 'Product Not Found In Cart',
        };

      if (
        !isEqual(
          mongoose.Types.ObjectId(cartData.userId),
          mongoose.Types.ObjectId(userData._id),
        )
      )
        return {
          statusCode: 400,
          success: false,
          errorName: errorName.__FAILED_EXECUTION,
          errorMsg:
            'You Are Not An Authorized User To Remove This Product From Cart',
        };

      const removeOutput = await Cart.deleteOne({
        _id: mongoose.Types.ObjectId(params.cartId),
      });

      if (removeOutput && removeOutput.deletedCount)
        return {
          statusCode: 200,
          success: true,
          msg: 'Product Removed From Cart SuccessFully',
        };

      return {
        statusCode: 400,
        success: false,
        errorName: errorName.__FAILED_EXECUTION,
        errorMsg: 'Failed To Remove Product From Cart',
      };
    } catch (error) {
      logger.error('From removeProductByCartId error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        errorName: errorName.__INTERNAL_SERVER_ERROR,
        errorMsg: 'An Error Occured While Removing Product From Cart',
      };
    }
  }

  static async changeProductQuantityByCartId({ params, body, userData }) {
    try {
      const cartData = await Cart.findOne({
        _id: mongoose.Types.ObjectId(params.cartId),
      });

      if (!cartData || !cartData._id)
        return {
          statusCode: 400,
          success: false,
          errorName: errorName.__FAILED_EXECUTION,
          errorMsg: 'Product Not Found In Cart',
        };

      if (
        !isEqual(
          mongoose.Types.ObjectId(cartData.userId),
          mongoose.Types.ObjectId(userData._id),
        )
      )
        return {
          statusCode: 400,
          success: false,
          errorName: errorName.__FAILED_EXECUTION,
          errorMsg: 'You Are Not An Authorized User To Change Product Quantity',
        };

      const updateOutput = await Cart.updateOne(
        {
          _id: mongoose.Types.ObjectId(params.cartId),
        },
        { quantity: body.quantity },
      );

      if (updateOutput && updateOutput.modifiedCount)
        return {
          statusCode: 200,
          success: true,
          msg: 'Changed Product Quantity In Cart Successfully',
        };

      return {
        statusCode: 400,
        success: false,
        errorName: errorName.__FAILED_EXECUTION,
        errorMsg: 'Failed To Change Product Quantity',
      };
    } catch (error) {
      logger.error('From changeProductQuantityByCartId error', {
        errorMsg: error,
      });

      return {
        success: false,
        statusCode: 500,
        errorName: errorName.__INTERNAL_SERVER_ERROR,
        errorMsg: 'An Error Occured While Changing Quantity Of Product In Cart',
      };
    }
  }

  static async getCart({ userData }) {
    try {
      const allCartData = await Cart.find({
        userId: mongoose.Types.ObjectId(userData._id),
      })
        .populate(Util.productCategoryPopulateObject())
        .lean();

      if (allCartData && Array.isArray(allCartData) && allCartData.length) {
        for (let singleCartIndex in allCartData) {
          if (
            allCartData[singleCartIndex].productId &&
            allCartData[singleCartIndex].productId.actualAmount
          ) {
            allCartData[singleCartIndex].cartValueWithoutDiscount =
              allCartData[singleCartIndex].productId.actualAmount *
              allCartData[singleCartIndex].quantity;
            allCartData[singleCartIndex].cartValueWithDiscount =
              Util.calculateProductValueWithDiscountInRuppee(
                allCartData[singleCartIndex].productId.actualAmount,
                allCartData[singleCartIndex].productId.discount,
                allCartData[singleCartIndex].quantity,
              );
          }
        }

        const cartValueWithDiscount = sumBy(
          allCartData,
          'cartValueWithDiscount',
        );

        const cartValueWithoutDiscount = sumBy(
          allCartData,
          'cartValueWithoutDiscount',
        );

        const cartValueOfActiveProductsWithDiscount = sumBy(
          allCartData,
          function (o) {
            if (o.productId && !o.productId.productOutOfStock) {
              return o.cartValueWithDiscount;
            }
          },
        );

        const cartValueOfActiveProductsWithoutDiscount = sumBy(
          allCartData,
          function (o) {
            if (o.productId && !o.productId.productOutOfStock) {
              return o.cartValueWithoutDiscount;
            }
          },
        );

        let finalCartData = {
          doc: allCartData,
          totalCartValueWithoutDiscount: cartValueWithDiscount
            ? cartValueWithDiscount
            : 0,
          totalCartValueWithDiscount: cartValueWithoutDiscount
            ? cartValueWithoutDiscount
            : 0,
          totalCartValueOfActiveProductsWithDiscount:
            cartValueOfActiveProductsWithDiscount
              ? cartValueOfActiveProductsWithDiscount
              : 0,
          totalCartValueOfActiveProductsWithoutDiscount:
            cartValueOfActiveProductsWithoutDiscount
              ? cartValueOfActiveProductsWithoutDiscount
              : 0,
          totalDataCount: allCartData.length,
        };

        return {
          statusCode: 200,
          success: true,
          records: finalCartData,
          msg: 'Cart Data Fetched Successfully',
        };
      }
      return {
        statusCode: 400,
        success: false,
        errorName: errorName.__FAILED_EXECUTION,
        errorMsg: 'No Products Found In Cart',
      };
    } catch (error) {
      logger.error('From get cart error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        errorName: errorName.__INTERNAL_SERVER_ERROR,
        errorMsg: 'An Error Occured While Getting All Products From Cart',
      };
    }
  }
}
module.exports = CartService;
