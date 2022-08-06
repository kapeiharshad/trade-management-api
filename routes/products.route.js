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
 *                            example: 12.32
 *                          specification:
 *                            type: string
 *                            example: one of the best product
 *                          categoryId:
 *                            type: string
 *                            example: 629e02d9ef765441783a3cc5
 *                          productImage:
 *                            type: array
 *                            example: 629e02d9ef765441783a3cc5
 *
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
