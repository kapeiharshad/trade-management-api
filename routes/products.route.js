const express = require('express');
const router = express.Router();
const ProductService = require('../services/products.service');
const Util = require('../helpers/Util.helper');
const {
  createProduct,
  editProduct,
  getProduct,
  // getAllPaginatedCategories,
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
