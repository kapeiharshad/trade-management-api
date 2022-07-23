const express = require('express');
const router = express.Router();
const Util = require('../helpers/Util.helper');
const CategoryService = require('../services/categories.service');
const {
  createCategory,
  editCategory,
  getCategory,
  // getAllPaginatedCategories,
} = require('../validation');

/**
 * @swagger
 * /categories/createCategory:
 *   post:
 *     description: Test route.
 *     responses:
 *       200:
 *         description: Returns a hello string.
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

router.get('/', async (req, res) => {
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
