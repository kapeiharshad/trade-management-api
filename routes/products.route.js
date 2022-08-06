const express = require('express');
const router = express.Router();
const ProductService = require('../services/products.service');
const Util = require('../helpers/util.helper');
const {
    createProduct,
    editProduct,
    getProduct,
    getUser,
} = require('../validation');

/**
 * @swagger
 * /products/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: This api will create product.
 *     tags:
 *      - products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: 62dbfaf07e7ccb28caf17d93
 *                 required: true
 *               productName:
 *                 type: string
 *                 example: mrf tyre
 *                 required: true
 *               actualAmount:
 *                 type: number
 *                 example: 100
 *                 required: true
 *               specification:
 *                 type: string
 *                 required: true
 *                 example: one of the best tyre in 2022
 *               productImage:
 *                 type: array
 *                  items:{} 
 *                 example:
 *                         - - val: "https://s3.amazon.com/helmet1"
 *                             sequence: 1
 *                         - - val: "https://s3.amazon.com/helmet1"
 *                             sequence: 2
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Product Created Successfully.
 *                 id:
 *                  type: string
 *                  example: 629e02d9ef765441783a3cc5
 *       400:
 *         description: Error response.
 *         content:
 *           application/json:
 *             schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/CategoryNotFound'
 *             examples:
 *               CategoryNotFound:
 *                 summary: Example of Category Does Not Exist
 *                 value:
 *                   success: false
 *                   msg: Category Does Not Exist,Cannot Create Product Of It
 *               CategoryInactive:
 *                 summary: Example of Category Is Not Active
 *                 value:
 *                   success: false
 *                   msg: "Category Is Not Active To Create New Product"
 *               FailedUniqueId:
 *                 summary: Example for Failure of Unique ProductId Generation
 *                 value:
 *                   success: false
 *                   msg: "Failed To Generate Unique ProductId"
 *               FailedToAddProduct:
 *                 summary: Example for Failure of Product Creation
 *                 value:
 *                   success: false
 *                   msg: "Failed To Add Product"
 *       500:
 *         description: Server Error response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: An Error Occured While Creating Product
 *components:
 *   schemas:
 *     CategoryNotFound:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           enum: [false]
 *         msg:
 *           type: string
 *       required:
 *         - success
 *         - msg
 */
router.post('/', createProduct, async (req, res) => {
    try {
        const result = await ProductService.createProduct({ body: req.body });

        if (result.error) {
            return Util.render(res, { success: false, msg: result.error });
        }

        return Util.render(res, result);
    } catch (error) {
        return Util.render(res, { success: false, msg: error });
    }
});

/**
 * @swagger
 * /products/{productId}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: This api will edit product.
 *     tags:
 *      - products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: 62dbfaf07e7ccb28caf17d93
 *                 required: true
 *               productName:
 *                 type: string
 *                 example: mrf tyre
 *                 required: true
 *               actualAmount:
 *                 type: number
 *                 example: 100
 *                 required: true
 *               specification:
 *                 type: string
 *                 required: true
 *                 example: one of the best tyre in 2022
 *               productStatus:
 *                 type: string
 *                 example: active
 *               productImage:
 *                 type: array
 *                  items:{} 
 *                 example:
 *                         - - val: "https://s3.amazon.com/helmet1"
 *                             sequence: 1
 *                         - - val: "https://s3.amazon.com/helmet1"
 *                             sequence: 2
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Product Updated Sucessfully.
 *                 id:
 *                  type: string
 *                  example: 629e02d9ef765441783a3cc5
 *       400:
 *         description: Error response.
 *         content:
 *           application/json:
 *             schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/CategoryNotFound'
 *             examples:
 *               CategoryNotFound:
 *                 summary: Example of Category Does Not Exist
 *                 value:
 *                   success: false
 *                   msg: Category Does Not Exist,Cannot Edit Product Of It
 *               ProductNotFound:
 *                 summary: Example for Product Not Found
 *                 value:
 *                   success: false
 *                   msg: Product Not Found
 *               FailedToUpdateProduct:
 *                 summary: Example for Failure of Product Updation
 *                 value:
 *                   success: false
 *                   msg: Failed To Update Product
 *       500:
 *         description: Server Error response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: An Error Occured While Editing Product
 *components:
 *   schemas:
 *     CategoryNotFound:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           enum: [false]
 *         msg:
 *           type: string
 *       required:
 *         - success
 *         - msg
 */
router.patch('/:productId', editProduct, async (req, res) => {
    try {
        const result = await ProductService.editProduct({
            body: req.body,
            params: req.params,
        });

        if (result.error) {
            return Util.render(res, { success: false, msg: result.error });
        }

        return Util.render(res, result);
    } catch (error) {
        return Util.render(res, { success: false, msg: error });
    }
});

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: This api will get product by its id.
 *     tags:
 *      - products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Product Fetched Successfully
 *                 record:
 *                   type: object
 *                   properties:
 *                          _id:
 *                            type: string
 *                            example: 629e02d9ef765441783a3cc5
 *                          productName:
 *                            type: string
 *                            example: helmet
 *                          productStatus:
 *                            type: string
 *                            example: active
 *                          productUniqueId:
 *                            type: string
 *                            example: 123456789912
 *                          actualAmount:
 *                            type: number
 *                            example: 12.32
 *                          discount:
 *                            type: number
 *                            example: 1
 *                          specification:
 *                            type: string
 *                            example: one of the best product
 *                          categoryId:
 *                            type: string
 *                            example: 629e02d9ef765441783a3cc5
 *                          productImage:
 *                            type: array
 *                             items:{} 
 *                            example:
 *                                   - - val: "https://s3.amazon.com/helmet1"
 *                                       sequence: 1
 *                                   - - val: "https://s3.amazon.com/helmet1"
 *                                       sequence: 2
 *                          createdAt:
 *                            type: date
 *                            example: 2022-06-06T13:36:25.766Z
 *                          updatedAt:
 *                            type: date
 *                            example: 2022-06-06T13:36:25.766Z
 *       404:
 *         description: Error response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Product Not Found
 *       500:
 *         description: Server Error response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: An Error Occured While Getting Product By Id
 */
router.get('/:productId', getProduct, async (req, res) => {
    try {
        const result = await ProductService.getProductById({ params: req.params });

        if (result.error) {
            return Util.render(res, { success: false, msg: result.error });
        }

        return Util.render(res, result);
    } catch (error) {
        return Util.render(res, { success: false, msg: error });
    }
});


/**
 * @swagger
 * /products/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: This api will get all match products with pagination.
 *     tags:
 *      - products
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: interger
 *           example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: interger
 *           example: 1
 *       - in: query
 *         name: sortKey
 *         schema:
 *           type: string
 *           example: productName,_id
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           example: desc,asc
 *       - in: query
 *         name: productName
 *         schema:
 *           type: string
 *           example: helmet
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Products fetched successfully.
 *                 records:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                        type: object
 *                        properties:
  *                          _id:
 *                            type: string
 *                            example: 629e02d9ef765441783a3cc5
 *                          productName:
 *                            type: string
 *                            example: helmet
 *                          productStatus:
 *                            type: string
 *                            example: active
 *                          productUniqueId:
 *                            type: string
 *                            example: 123456789912
 *                          actualAmount:
 *                            type: number
 *                            example: 12.32
 *                          discount:
 *                            type: number
 *                            example: 1
 *                          specification:
 *                            type: string
 *                            example: one of the best product
 *                          categoryId:
 *                            type: string
 *                            example: 629e02d9ef765441783a3cc5
 *                          productImage:
 *                            type: array
 *                             items:{} 
 *                            example:
 *                                   - - val: "https://s3.amazon.com/helmet1"
 *                                       sequence: 1
 *                                   - - val: "https://s3.amazon.com/helmet1"
 *                                       sequence: 2
 *                          createdAt:
 *                            type: date
 *                            example: 2022-06-06T13:36:25.766Z
 *                          updatedAt:
 *                            type: date
 *                            example: 2022-06-06T13:36:25.766Z
 *                      
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 1
 *
 *       500:
 *         description: Server Error response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: An error occurs.
 */
router.get('/', getUser, async (req, res) => {
    try {
        const result = await ProductService.getProduct({
            query: req.query,
        });

        if (result.error) {
            return Util.render(res, { success: false, msg: result.error });
        }

        return Util.render(res, result);
    } catch (error) {
        return Util.render(res, { success: false, msg: error });
    }
});

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: This api will delete product by its id.
 *     tags:
 *      - products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Product Deleted Successfully.
 *       404:
 *         description: Error response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Product Not Found
 *       400:
 *         description: Error response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Failed To Delete Product
 *       500:
 *         description: Server Error response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: An Error Occured While Deleting Product
 */
router.delete('/:productId', getProduct, async (req, res) => {
    try {
        const result = await ProductService.deleteProduct({ params: req.params });

        if (result.error) {
            return Util.render(res, { success: false, msg: result.error });
        }

        return Util.render(res, result);
    } catch (error) {
        return Util.render(res, { success: false, msg: error });
    }
});

module.exports = router;
