const express = require('express');
const router = express.Router();
const Utility = require('../helpers/utility');
const UserService = require('../services/users.service');
const { addUser, editUser, getUser } = require('../validation');

/**
 * @swagger
 * /users/:
 *   get:
 *     description: Test route.
 *     responses:
 *       200:
 *         description: Returns a hello string.
 */
router.post('/', addUser, async (req, res) => {
  try {
    const result = await UserService.addUser({ body: req.body });
    if (result.error) {
      return Utility.render(res, { success: false, msg: result.error });
    }
    return Utility.render(res, result);
  } catch (error) {
    return Utility.render(res, { success: false, msg: error });
  }
});

router.patch('/:userId', editUser, async (req, res) => {
  try {
    const result = await UserService.editUser({
      body: req.body,
      params: req.params,
    });
    if (result.error) {
      return Utility.render(res, { success: false, msg: result.error });
    }
    return Utility.render(res, result);
  } catch (error) {
    return Utility.render(res, { success: false, msg: error });
  }
});

router.get('/:userId', getUser, async (req, res) => {
  try {
    const result = await UserService.getUser({ params: req.params });
    if (result.error) {
      return Utility.render(res, { success: false, msg: result.error });
    }
    return Utility.render(res, result);
  } catch (error) {
    return Utility.render(res, { success: false, msg: error });
  }
});
module.exports = router;
