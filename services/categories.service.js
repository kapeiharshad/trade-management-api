
const logger = require('../helpers/logger.helper');
const Category = require('../models/categories.model')
const pagination = require('../helpers/pagination.helper');
const mongoose = require("mongoose")
class CategoryService {
  static async createCategory({ body }) {
    try {
      const saveObj = {
        categoryName: body.categoryName,
      };

      if (body.categoryStatus) {
        saveObj.categoryStatus = body.categoryStatus;
      }

      const createOutput = await Category.create(saveObj);

      if (createOutput && createOutput._id) {
        return {
          success: true,
          statusCode: 200,
          msg: 'Category Created Sucessfully',
        };
      }

      return {
        success: false,
        statusCode: 400,
        msg: 'Failed To Add Category',
      };
    } catch (error) {
      console.log("ibsiddd err", error)
      logger.error('From create category error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An Error Occured While Creating Category',
      };
    }
  }

  static async editCategory({ body, params }) {
    try {

      let oneCategory = await Category.findOne({ _id: mongoose.Types.ObjectId(params.categoryId) })

      const { _id } = oneCategory

      if (!_id) return {
        success: false,
        statusCode: 400,
        msg: 'Category Not Found',

      }

      const editObj = {};

      if (body.categoryName) editObj.categoryName = body.categoryName;

      if (body.categoryStatus) editObj.categoryStatus = body.categoryStatus;

      const editOutput = await Category.updateOne(
        { _id: params.categoryId },
        editObj,
      );

      if (editOutput && editOutput.modifiedCount) {
        return {
          success: true,
          statusCode: 200,
          msg: 'Category Updated Successfully',
        };
      }

      return {
        success: false,
        statusCode: 400,
        msg: 'Failed To Update Category',
      };

    } catch (error) {
      logger.error('From edit category error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An Error Occured While Editing Category',
      };
    }
  }

  static async getCategoryById({ params }) {
    try {
      const categoryOutput = await Category.findOne({ _id: mongoose.Types.ObjectId(params.categoryId) });

      if (categoryOutput && categoryOutput._id) {
        return {
          success: true,
          statusCode: 200,
          msg: 'Categories Fetched Successfully',
          data: categoryOutput,
        };
      }

      return {
        success: false,
        statusCode: 204,
        msg: 'Category Not Found',
      };
    } catch (error) {
      logger.error('From get category error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An Error Occured While Getting Category By Id',
      };
    }
  }

  static async getCategory({ query }) {
    try {
      const projection = {
        categoryName: 1
      };

      const paginationObj = new pagination();
      console.log("holaaaa", query)
      const docs = await paginationObj.generatePagination(
        Category,
        query,
        projection,
      );
      return {
        success: true,
        statusCode: 200,
        msg: 'Categories fetched successfully.',
        records: docs,
      };
    } catch (error) {
      console.log("hiii", error)
      logger.error('From getCategories error', { errorMsg: error });
      return {
        success: false,
        statusCode: 500,
        msg: 'An error occurs',
      };
    }
  }
}
module.exports = CategoryService;
