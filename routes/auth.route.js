const express = require('express');
const router = express.Router();
const Render = require('../helpers/render.helper');
const AuthService = require('../services/auth.service');

const {
  login,
  changePassword,
  forgotPassword,
  resetPasswordVerify,
  resetPassword,
  logoutValidation,
} = require('../validation');

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
    const result = await AuthService.changePassword(
      req.userData,
      req.body.oldPassword,
      req.body.newPassword,
    );
    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }
    return Render.render(res, result);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});

router.post('/forgotPassword', forgotPassword, async (req, res) => {
  try {
    const result = await AuthService.forgotPassword({ body: req.body });
    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }
    return Render.render(res, result);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});

router.post('/resetPasswordVerify', resetPasswordVerify, async (req, res) => {
  try {
    const result = await AuthService.resetPasswordVerify({ body: req.body });
    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }
    return Render.render(res, result);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});

router.post('/resetPassword', resetPassword, async (req, res) => {
  try {
    const result = await AuthService.resetPassword({ body: req.body });
    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }
    return Render.render(res, result);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});

router.post('/logout', logoutValidation, async (req, res) => {
  try {
    let authHeader = '';
    if (req.headers['authorization']) {
      authHeader = req.headers['authorization'].replace('Bearer ', '');
    }
    const result = await AuthService.logout(authHeader, req.body);
    if (result.error) {
      return Render.render(res, { success: false, msg: result.error });
    }
    return Render.render(res, result);
  } catch (error) {
    return Render.render(res, { success: false, msg: error });
  }
});
module.exports = router;
