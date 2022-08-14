const express = require('express');
const router = express.Router();
const CartService = require('../services/cart.service');
const Util = require('../helpers/util.helper');
const { addToCart, cartIdValidation, validUser } = require('../validation');

router.post('/', validUser, addToCart, async (req, res) => {
  try {
    const userData = { _id: req.userData._id };

    const result = await CartService.addToCart({ body: req.body, userData });

    if (result.error) {
      return Util.render(res, { success: false, msg: result.error });
    }

    return Util.render(res, result);
  } catch (error) {
    return Util.render(res, { success: false, msg: error });
  }
});

router.get('/:cartId', validUser, cartIdValidation, async (req, res) => {
  try {
    const result = await CartService.getOneCart({ params: req.params });

    if (result.error) {
      return Util.render(res, { success: false, msg: result.error });
    }

    return Util.render(res, result);
  } catch (error) {
    console.log('insider errorrrr', error);
    return Util.render(res, { success: false, msg: error });
  }
});

router.delete('/:cartId', validUser, cartIdValidation, async (req, res) => {
  try {
    const userData = { _id: req.userData._id };

    const result = await CartService.removeProductByCartId({
      params: req.params,
      userData,
    });

    if (result.error) {
      return Util.render(res, { success: false, msg: result.error });
    }

    return Util.render(res, result);
  } catch (error) {
    console.log('insider errorrrr', error);
    return Util.render(res, { success: false, msg: error });
  }
});

router.patch('/:cartId', validUser, cartIdValidation, async (req, res) => {
  try {
    const userData = { _id: req.userData._id };

    const result = await CartService.changeProductQuantityByCartId({
      params: req.params,
      body: req.body,
      userData,
    });

    if (result.error) {
      return Util.render(res, { success: false, msg: result.error });
    }

    return Util.render(res, result);
  } catch (error) {
    console.log('insider errorrrr', error);
    return Util.render(res, { success: false, msg: error });
  }
});

router.get('/', validUser, async (req, res) => {
  try {
    const userData = { _id: req.userData._id };

    const result = await CartService.getCart({ userData });

    if (result.error) {
      return Util.render(res, { success: false, msg: result.error });
    }

    return Util.render(res, result);
  } catch (error) {
    console.log('insider errorrrr', error);
    return Util.render(res, { success: false, msg: error });
  }
});

module.exports = router;
