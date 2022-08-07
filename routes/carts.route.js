const express = require('express');
const CartService = require('../services/carts.service');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const result = await CartService.addToCart({ body: req.body });
        if (result.error) {
            return Util.render(res, { success: false, msg: result.error });
        }
        return Util.render(res, result);
    } catch (error) {
        return Util.render(res, { success: false, msg: error });
    }
});
module.exports = router;