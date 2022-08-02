const logger = require('../helpers/logger.helper');
const Category = require('../models/categories.model');
const pagination = require('../helpers/pagination.helper');
const mongoose = require('mongoose');
const Util = require('../helpers/util.helper');
class CategoryService {
  static async createCategory({ body }) {
    try {
      const saveObj = {
        categoryName: body.categoryName,
      };

      if (body.categoryStatus) {
        saveObj.categoryStatus = body.categoryStatus;
      }

      const uniqueId = await Util.generateUUID();

      if (!uniqueId) {
        return {
          success: false,
          statusCode: 400,
          msg: 'Failed To Generate Unique CategoryId',
        };
      }

      saveObj.categoryUniqueId = uniqueId;

      const createOutput = await Category.create(saveObj);

      if (createOutput && createOutput._id) {
        return {
          success: true,
          msg: 'Category Created Sucessfully',
        };
      }

      return {
        success: false,
        statusCode: 400,
        msg: 'Failed To Add Category',
      };
    } catch (error) {
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
      const oneCategory = await Category.findOne(
        {
          _id: mongoose.Types.ObjectId(params.categoryId),
        },
        {
          categoryStatus: 1,
        },
      );

      const { _id, categoryStatus } = oneCategory;

      if (!_id || categoryStatus != 'active')
        return {
          success: false,
          statusCode: 404,
          msg: 'Category Not Found',
        };

      if (body.categoryName) oneCategory.categoryName = body.categoryName;

      const editOutput = await oneCategory.save();
      if (editOutput && editOutput._id) {
        return {
          success: true,
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
      const categoryOutput = await Category.findOne({
        _id: mongoose.Types.ObjectId(params.categoryId),
      });

      if (categoryOutput && categoryOutput._id) {
        return {
          success: true,
          msg: 'Categories Fetched Successfully',
          record: categoryOutput,
        };
      }

      return {
        success: false,
        statusCode: 404,
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
        categoryName: 1,
      };
      const paginationObj = new pagination();
      const statusQuery = { categoryStatus: 'active' };
      const docs = await paginationObj.generatePagination(
        Category,
        query,
        statusQuery,
        projection,
      );
      return {
        success: true,
        msg: 'Categories fetched successfully.',
        records: docs,
      };
    } catch (error) {
      logger.error('From getCategories error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An error occurs',
      };
    }
  }

  static async deleteCategory({ params }) {
    try {
      const oneCategory = await Category.findOne(
        { _id: mongoose.Types.ObjectId(params.categoryId) },
        {
          _id: 1,
          categoryStatus: 1,
        },
      );

      const { _id, categoryStatus } = oneCategory;

      if (!_id || !categoryStatus || categoryStatus != 'active')
        return {
          success: false,
          statusCode: 404,
          msg: 'Category Not Found',
        };

      const deletedData = await Category.updateOne(
        { _id: mongoose.Types.ObjectId(params.categoryId) },
        { categoryStatus: 'inactive' },
      );

      if (deletedData && deletedData.modifiedCount) {
        return {
          success: true,
          msg: 'Category Deleted Successfully.',
        };
      }

      return {
        success: false,
        statusCode: 400,
        msg: 'Failed To Delete Category',
      };
    } catch (error) {
      logger.error('From deleteCategory error', { errorMsg: error });

      return {
        success: false,
        statusCode: 500,
        msg: 'An Error Occured While Deleting Category',
      };
    }
  }
}
module.exports = CategoryService;
