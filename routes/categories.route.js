const express = require('express');
const router = express.Router();
const Util = require('../helpers/Util.helper');
const CategoryService = require('../services/categories.service');
const {
  createCategory,
  editCategory,
  getCategory,
  getUser,
} = require('../validation');

/**
 * @swagger
 * /categories/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: This api will create Category.
 *     tags:
 *      - categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 required: true
 *                 example: LeanneGraham01
 *               categoryStatus:
 *                 type: string
 *                 example: active
 *
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
 *                   example: Category Created Sucessfully.
 *                 id:
 *                  type: string
 *                  example: 629e02d9ef765441783a3cc5
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
 *                   example: Failed To Add Category.
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
 *                   example: An Error Occured While Creating Category.
 */
router.post('/', createCategory, async (req, res) => {
  try {
    const result = await CategoryService.createCategory({ body: req.body });

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
 * /categories/{categoryId}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: This api will edit Category.
 *     tags:
 *      - categories
 *     parameters:
 *       - in: path
 *         name: categoryId
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
 *               categoryName:
 *                 type: string
 *                 example: helmet
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
 *                   example: Category Updated Successfully.
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
 *                   example: Category Not Found.
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
 *                   example: Failed To Update Category.
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
 *                   example: An Error Occured While Editing Category.
 */
router.patch('/:categoryId', editCategory, async (req, res) => {
  try {
    const result = await CategoryService.editCategory({
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
 * /categories/{categoryId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: This api will get category by its id.
 *     tags:
 *      - categories
 *     parameters:
 *       - in: path
 *         name: categoryId
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
 *                   example: Categories Fetched Successfully.
 *                 record:
 *                   type: object
 *                   properties:
 *                          _id:
 *                            type: string
 *                            example: 629e02d9ef765441783a3cc5
 *                          categoryName:
 *                            type: string
 *                            example: helmet
 *                          categoryStatus:
 *                            type: string
 *                            example: active
 *                          categoryUniqueId:
 *                            type: string
 *                            example: 123456789912
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
 *                   example: Category Not Found.
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
 *                   example: An Error Occured While Getting Category By Id.
 */
router.get('/:categoryId', getCategory, async (req, res) => {
  try {
    const result = await CategoryService.getCategoryById({
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
 * /categories/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: This api will get all match category with pagination.
 *     tags:
 *      - categories
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
 *           example: categoryName,_id
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           example: desc,asc
 *       - in: query
 *         name: categoryName
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
 *                   example: Categories fetched successfully.
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
 *                          categoryName:
 *                            type: string
 *                            example: helemt
 *                          categoryStatus:
 *                            type: string
 *                            example: active
 *                          categoryUniqueId:
 *                            type: string
 *                            example: 123456789912
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
    const result = await CategoryService.getCategory({
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
 * /categories/{categoryId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: This api will delete category by its id.
 *     tags:
 *      - categories
 *     parameters:
 *       - in: path
 *         name: categoryId
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
 *                   example: Category Deleted Successfully.
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
 *                   example: Category Not Found
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
 *                   example: Failed To Delete Category
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
 *                   example: An Error Occured While Deleting Category
 */
router.delete('/:categoryId', getCategory, async (req, res) => {
  try {
    const result = await CategoryService.deleteCategory({ params: req.params });

    if (result.error) {
      return Util.render(res, { success: false, msg: result.error });
    }

    return Util.render(res, result);
  } catch (error) {
    return Util.render(res, { success: false, msg: error });
  }
});
module.exports = router;
