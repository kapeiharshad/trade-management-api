const logger = require('../helpers/logger.helper');
const Product = require('../models/products.model');
const Category = require('../models/categories.model');
const mongoose = require('mongoose');
const Util = require('../helpers/Util.helper');
class ProductService {
  static async createProduct({ body }) {
    try {
      const categoryOutput = await Category.findOne(
        {
          _id: mongoose.Types.ObjectId(body.categoryId),
        },
        {
          categoryStatus: 1,
        },
      );

      const { _id, categoryStatus } = categoryOutput;

      if (!_id)
        return {
          success: false,
          statusCode: 400,
          msg: 'Category Does Not Exist,Cannot Create Product Of It',
        };

      if (categoryStatus != 'active')
        return {
          success: false,
          statusCode: 400,
          msg: 'Category Is Not Active To Create New Product',
        };

      const saveObj = {
        productName: body.productName,
        actualAmount: body.actualAmount,
        categoryId: body.categoryId,
        productImage: body.productImage,
      };

      if (body.specification) saveObj.specification = body.specification;

      if (body.productStatus) saveObj.productStatus = body.productStatus;

      if (body.discount) saveObj.discount = body.discount;

      const uniqueId = await Util.generateNanoId();

      if (!uniqueId) {
        return {
          success: false,
          statusCode: 400,
          msg: 'Failed To Generate Unique ProductId',
        };
      }

      saveObj.productUniqueId = uniqueId;

      const createOutput = await Product.create(saveObj);

      if (createOutput && createOutput._id) {
        return {
          success: true,
          statusCode: 200,
          msg: 'Product Created Sucessfully',
        };
      }

      return {
        success: false,
        statusCode: 400,
        msg: 'Failed To Add Product',
      };
    } catch (error) {
      logger.error('From create product error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An Error Occured While Creating Product',
      };
    }
  }

  static async editProduct({ body, params }) {
    try {
      let oneProduct = await Product.findOne(
        { _id: mongoose.Types.ObjectId(params.productId) },
        {
          _id: 1,
          productStatus: 1,
        },
      );

      const { _id, productStatus } = oneProduct;

      if (!_id || productStatus != 'active')
        return {
          success: false,
          statusCode: 400,
          msg: 'Product Not Found',
        };

      if (body.productName) {
        oneProduct.productName = body.productName;
      }

      if (body.actualAmount) {
        oneProduct.actualAmount = body.actualAmount;
      }

      if (body.productImage) {
        oneProduct.productImage = body.productImage;
      }

      if (body.discount) {
        oneProduct.discount = body.discount;
      }

      if (body.specification) {
        oneProduct.specification = body.specification;
      }

      if (body.categoryId) {
        const categoryExist = await Category.findOne(
          {
            _id: mongoose.Types.ObjectId(body.categoryId),
          },
          { _id: 1, categoryStatus: 1 },
        );

        if (
          !categoryExist ||
          !categoryExist.categoryStatus ||
          categoryExist.categoryStatus != 'active'
        ) {
          return {
            success: false,
            statusCode: 400,
            msg: 'Category Does Not Exist,Cannot Edit Product Of It',
          };
        }

        oneProduct.categoryId = body.categoryId;
      }

      const editOutput = await oneProduct.save();

      if (editOutput && editOutput._id) {
        return {
          success: true,
          statusCode: 200,
          msg: 'Product Updated Successfully',
        };
      }

      return {
        success: false,
        statusCode: 400,
        msg: 'Failed To Update Product',
      };
    } catch (error) {
      logger.error('From edit product error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An Error Occured While Editing Product',
      };
    }
  }

  static async getProductById({ params }) {
    try {
      const productOutput = await Product.findOne({
        _id: mongoose.Types.ObjectId(params.productId),
        productStatus: 'active',
      });

      if (productOutput && productOutput._id) {
        return {
          success: true,
          statusCode: 200,
          msg: 'Product Fetched Successfully',
          record: productOutput,
        };
      }

      return {
        success: false,
        statusCode: 404,
        msg: 'Product Not Found',
      };
    } catch (error) {
      logger.error('From get Product error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An Error Occured While Getting Product By Id',
      };
    }
  }

  static async deleteProduct({ params }) {
    try {
      let oneProduct = await Product.findOne(
        { _id: mongoose.Types.ObjectId(params.productId) },
        {
          _id: 1,
          productStatus: 1,
        },
      );

      const { _id, productStatus } = oneProduct;

      if (!_id || !productStatus || productStatus != 'active')
        return {
          success: false,
          statusCode: 400,
          msg: 'Product Not Found',
        };

      const deletedData = await Product.updateOne(
        { _id: mongoose.Types.ObjectId(params.productId) },
        { status: 'inactive' },
      );

      if (deletedData && deletedData.modifiedCount) {
        return {
          success: true,
          statusCode: 200,
          msg: 'Product Deleted Successfully.',
        };
      }

      return {
        success: false,
        statusCode: 400,
        msg: 'Failed To Delete Product',
      };
    } catch (error) {
      logger.error('From deleteProduct error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An Error Occured While Deleting Product',
      };
    }
  }
}
module.exports = ProductService;
