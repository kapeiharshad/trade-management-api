const Product = require("../models/products.model")
const mongoose = require("mongoose")
class ProductService {
    static async createProduct({ body }) {
        try {

            const categoryOutput = await Category.findOne({ _id: mongoose.Types.ObjectId(body.categoryId) })

            const { _id, status } = categoryOutput

            if (!_id) return {
                success: false,
                statusCode: 400,
                msg: 'Category Does Not Exist,Cannot Create Product Of It',

            }

            if (status != 'active') return {
                success: false,
                statusCode: 400,
                msg: 'Category Is Not Active To Create New Product',

            }

            const saveObj = {
                productName: body.productName,
                actualAmount: body.actualAmount,
                categoryId: body.categoryId,
                productImage: body.productImage
            }

            if (body.specification) saveObj.specification = body.specification

            if (body.productStatus) saveObj.productStatus = body.productStatus

            if (body.discount) saveObj.discount = body.discount

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

            let oneProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(params.productId) }, {
                _id: 1
            })

            const { _id } = oneProduct

            if (!_id) return {
                success: false,
                statusCode: 400,
                msg: 'Product Not Found',

            }

            const editObj = {};

            if (body.productName) {
                editObj.productName = body.productName
            }

            if (body.actualAmount) {
                editObj.actualAmount = body.actualAmount
            }

            if (body.productImage) {
                editObj.productImage = body.productImage
            }

            if (body.discount) {
                editObj.discount = body.discount
            }

            if (body.specification) {
                editObj.specification = body.specification
            }

            if (body.categoryId) {
                editObj.categoryId = body.categoryId
            }

            if (body.productStatus) {
                editObj.productStatus = body.productStatus
            }

            const editOutput = await Product.updateOne(
                { _id: mongoose.Types.ObjectId(params.productId) },
                editObj,
            );

            if (editOutput && editOutput.modifiedCount) {
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
            const productOutput = await Product.findOne({ _id: mongoose.Types.ObjectId(params.productId) });

            if (productOutput && productOutput._id) {
                return {
                    success: true,
                    statusCode: 200,
                    msg: 'Product Fetched Successfully',
                    data: productOutput,
                };
            }

            return {
                success: false,
                statusCode: 204,
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

            let oneProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(params.productId) }, {
                _id: 1, productStatus: 1
            })

            const { _id, productStatus } = oneProduct

            if (!_id || !productStatus || productStatus != 'active') return {
                success: false,
                statusCode: 400,
                msg: 'Product Not Found'
            }

            const deletedData = await Product.updateOne(
                { _id: mongoose.Types.ObjectId(params.productId) },
                { status: 'inactive' },
            );

            if (deletedData && deletedData.nModified) {
                return {
                    success: true,
                    statusCode: 200,
                    msg: 'Product Deleted Successfully.',
                };
            }

            return {
                success: false,
                statusCode: 404,
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
