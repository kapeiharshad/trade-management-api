const express = require('express');
const router = express.Router();
const Util = require('../helpers/util.helper');
const AuthService = require('../services/auth.service');

const {
  login,
  changePassword,
  forgotPassword,
  resetPasswordVerify,
  resetPassword,
  logoutValidation,
} = require('../validation');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: This api will use for login.
 *     tags:
 *      - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: anna12@yopmail.com
 *               password:
 *                 type: string
 *                 example: password12
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
 *                 token:
 *                   type: string
 *       401:
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
 *                   example: Email or password is incorrect!
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
router.post('/login', login, async (req, res) => {
  try {
    const loginResult = await AuthService.login(
      req.body.email,
      req.body.password,
    );
    if (loginResult.error) {
      return Util.render(res, { success: false, msg: loginResult.error });
    }
    return Util.render(res, loginResult);
  } catch (error) {
    return Util.render(res, { success: false, msg: error });
  }
});

/**
 * @swagger
 * /auth/changePassword:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: This api use to change password.
 *     tags:
 *      - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: password
 *               newPassword:
 *                 type: string
 *                 example: password12
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
 *                   example: Password changed successfully
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
 *                   example: Entered password's didn't matched.
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
router.post('/changePassword', changePassword, async (req, res) => {
  try {
    const result = await AuthService.changePassword(
      req.userData,
      req.body.oldPassword,
      req.body.newPassword,
    );
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
 * /auth/forgotPassword:
 *   post:
 *     description: This api will use to generate email link for forget password.
 *     tags:
 *      - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: anna12@yopmail.com
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
 *                   example: The reset password link has been sent to your email address successfully
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
 *                   example: The Email is not registered with us
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
router.post('/forgotPassword', forgotPassword, async (req, res) => {
  try {
    const result = await AuthService.forgotPassword({ body: req.body });
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
 * /auth/resetPasswordVerify:
 *   post:
 *     description: This api will verify the reset password link.
 *     tags:
 *      - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
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
 *                   example: Link verified successfully
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
 *                   example: Link verified unsuccessfully
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
router.post('/resetPasswordVerify', resetPasswordVerify, async (req, res) => {
  try {
    const result = await AuthService.resetPasswordVerify({ body: req.body });
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
 * /auth/resetPassword:
 *   post:
 *     description: This api will reset password.
 *     tags:
 *      - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: password12
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
 *                   example: Password reset successfully
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
 *                   example: Reset password unsuccessfully
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
router.post('/resetPassword', resetPassword, async (req, res) => {
  try {
    const result = await AuthService.resetPassword({ body: req.body });
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
 * /auth/logout:
 *   post:
 *     description: This api will logout.
 *     tags:
 *      - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
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
 *                   example: Password reset successfully
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
 *                   example: Reset password unsuccessfully
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
router.post('/logout', logoutValidation, async (req, res) => {
  try {
    let authHeader = '';
    if (req.headers['authorization']) {
      authHeader = req.headers['authorization'].replace('Bearer ', '');
    }
    const result = await AuthService.logout(authHeader, req.body);
    if (result.error) {
      return Util.render(res, { success: false, msg: result.error });
    }
    return Util.render(res, result);
  } catch (error) {
    return Util.render(res, { success: false, msg: error });
  }
});
module.exports = router;
