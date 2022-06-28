const express = require('express');
const router = express.Router();
const Render = require('../helpers/render.helper');
const CategoryService = require('../services/categories.service');
// const {
//   createCategory,
//   editCategory,
//   getCategory,
//   getAllPaginatedCategories,
// } = require('../validation');

/**
 * @swagger
 * /categories/createCategory:
 *   post:
 *     description: Test route.
 *     responses:
 *       200:
 *         description: Returns a hello string.
 */

router.post('/', async (req, res) => {
  try {
    const result = await CategoryService.createCategory({ body: req.body });

    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }

    return Render.render(res, result);
  } catch (error) {
    console.log("inside error of category", error)
    return Render.render(res, { success: false, msg: error });
  }
});

router.patch('/:categoryId', async (req, res) => {
  try {
    console.log("categorrrr", req.params)
    const result = await CategoryService.editCategory({
      body: req.body,
      params: req.params,
    });

    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }

    return Render.render(res, result);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});

router.get('/:categoryId', async (req, res) => {
  try {
    const result = await CategoryService.getCategoryById({ params: req.params });

    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }

    return Render.render(res, result);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});

router.get(
  '/',
  async (req, res) => {
    try {
      const result = await CategoryService.getCategory({
        query: req.query,
      });

      if (result.error) {
        return Render.render(res, { success: false, msg: result.error });
      }

      return Render.render(res, result);
    } catch (error) {
      return Render.render(res, { success: false, msg: error });
    }
  },
);

router.delete('/:categoryId', deleteUser, async (req, res) => {
  try {
    const result = await CategoryService.deleteCategory({ params: req.params });

    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }

    return Render.render(res, result);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});
module.exports = router;
