const express = require('express');
const router = express.Router();
const Render = require('../helpers/render.helper');
const AuthService = require('../services/auth.service');

const { login, changePassword } = require('../validation');

router.post('/login', login, async (req, res) => {
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

router.post('/changePassword', changePassword, async (req, res) => {
  try {
    const loginResult = await AuthService.changePassword(
      req.userData,
      req.body.oldPassword,
      req.body.newPassword,
    );
    if (loginResult.error) {
      return Render.render(res, { success: false, msg: loginResult.error });
    }
    return Render.render(res, loginResult);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});

router.post('/forgotPassword', async (req, res) => {
  try {
    const forgotResult = await AuthService.forgotPassword({ body: req.body });
    return Render.render(res, forgotResult);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});
module.exports = router;
