const express = require('express');
const router = express.Router();
const Render = require('../helpers/render.helper');
const AuthService = require('../services/auth.service');

router.post('/login', async (req, res) => {
  try {
    const loginResult = await AuthService.login(
      req.body.email,
      req.body.password,
    );
    if (loginResult.error) {
      return Render.render(res, { success: false, msg: loginResult.error });
    }
    return Render.render(res, loginResult);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});
module.exports = router;
