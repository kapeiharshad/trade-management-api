const express = require('express');
const router = express.Router();
const ProductService = require("../services/products.service")
const Render = require('../helpers/render.helper');

router.post('/', async (req, res) => {
    try {
        const result = await ProductService.createProduct({ body: req.body });

        if (result.error) {
            return Render.render(res, { success: false, msg: result.error });
        }

        return Render.render(res, result);
    } catch (error) {
        console.log("inside error of product", error)
        return Render.render(res, { success: false, msg: error });
    }
});

router.patch('/:productId', async (req, res) => {
    try {
        const result = await ProductService.editProduct({
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

router.get('/:productId', async (req, res) => {
    try {
        const result = await ProductService.getProductById({ params: req.params });

        if (result.error) {
            return Render.render(res, { success: false, msg: result.error });
        }

        return Render.render(res, result);
    } catch (error) {
        return Render.render(res, { success: false, msg: error });
    }
});

router.delete('/:productId', deleteUser, async (req, res) => {
    try {
        const result = await UserService.deleteProduct({ params: req.params });

        if (result.error) {
            return Render.render(res, { success: false, msg: result.error });
        }

        return Render.render(res, result);
    } catch (error) {
        return Render.render(res, { success: false, msg: error });
    }
});

module.exports = router;
