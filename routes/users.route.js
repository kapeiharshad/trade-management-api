const express = require('express');
const router = express.Router();
const Utility = require('../helpers/utility');
const UserService = require('../services/users.service');
const {
  addUser,
  editUser,
  getUser,
  getUserById,
  deleteUser,
} = require('../validation');

/**
 * @swagger
 * /users/:
 *   post:
 *     description: This api will create user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: LeanneGraham01
 *               firstName:
 *                 type: string
 *                 example: Leanne
 *               lastName:
 *                 type: string
 *                 example: Graham
 *               contact:
 *                 type: string
 *                 required: true
 *                 example: 1234564890
 *               gender:
 *                 type: string
 *                 example: Male
 *               email:
 *                 type: string
 *                 required: true
 *                 unique: true
 *                 example: leannegraham@yopmail.com
 *               password:
 *                 type: string
 *                 required: true
 *                 example: 12312354d
 *               userType:
 *                 type: string
 *                 example: user
 *               status:
 *                 type: string
 *                 example: active
 *               createdAt:
 *                 type: date
 *                 example: 2022-06-06T13:36:25.766Z
 *               updatedAt:
 *                 type: date
 *                 example: 2022-06-06T13:36:25.766Z
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
 *                   example: User added successfully.
 *                 id:
 *                  type: string
 *                  example: 629e02d9ef765441783a3cc5
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
 *                   example: User added unsuccessfully.
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

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     description: This api will edit user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: harshad433
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
 *                   example: User edited successfully.
 *       404:
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
 *                   example: User not founded or no content to modify.
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

/**
 * @swagger
 * /users/:
 *   get:
 *     description: This api will get all match users with pagination.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: interger
 *           example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: interger
 *           example: 1
 *       - in: query
 *         name: sortKey
 *         schema:
 *           type: string
 *           example: userName,_id
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           example: desc,asc
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *           example: harshad
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
 *                   example: Users fected successfully.
 *                 records:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                            example: 629e02d9ef765441783a3cc5
 *                          userName:
 *                            type: string
 *                            example: LeanneGraham01
 *                          firstName:
 *                            type: string
 *                            example: Leanne
 *                          lastName:
 *                            type: string
 *                            example: Graham
 *                          contact:
 *                            type: string
 *                            required: true
 *                            example: 1234564890
 *                          gender:
 *                            type: string
 *                            example: Male
 *                          email:
 *                            type: string
 *                            required: true
 *                            unique: true
 *                            example: leannegraham@yopmail.com
 *                          password:
 *                            type: string
 *                            required: true
 *                            example: 12312354d
 *                          userType:
 *                            type: string
 *                            example: user
 *                          status:
 *                            type: string
 *                            example: active
 *                          createdAt:
 *                            type: date
 *                            example: 2022-06-06T13:36:25.766Z
 *                          updatedAt:
 *                            type: date
 *                            example: 2022-06-06T13:36:25.766Z
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 1
 *
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
router.get('/', getUser, async (req, res) => {
  try {
    const result = await UserService.getUser({ query: req.query });
    if (result.error) {
      return Utility.render(res, { success: false, msg: result.error });
    }
    return Utility.render(res, result);
  } catch (error) {
    return Utility.render(res, { success: false, msg: error });
  }
});

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     description: This api will get user by its id.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
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
 *                   example: User edited successfully.
 *                 record:
 *                   type: object
 *                   properties:
 *                          _id:
 *                            type: string
 *                            example: 629e02d9ef765441783a3cc5
 *                          userName:
 *                            type: string
 *                            example: LeanneGraham01
 *                          firstName:
 *                            type: string
 *                            example: Leanne
 *                          lastName:
 *                            type: string
 *                            example: Graham
 *                          contact:
 *                            type: string
 *                            required: true
 *                            example: 1234564890
 *                          gender:
 *                            type: string
 *                            example: Male
 *                          email:
 *                            type: string
 *                            required: true
 *                            unique: true
 *                            example: leannegraham@yopmail.com
 *                          password:
 *                            type: string
 *                            required: true
 *                            example: 12312354d
 *                          userType:
 *                            type: string
 *                            example: user
 *                          status:
 *                            type: string
 *                            example: active
 *                          createdAt:
 *                            type: date
 *                            example: 2022-06-06T13:36:25.766Z
 *                          updatedAt:
 *                            type: date
 *                            example: 2022-06-06T13:36:25.766Z
 *
 *       404:
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
 *                   example: User not founded.
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
router.get('/:userId', getUserById, async (req, res) => {
  try {
    const result = await UserService.getUserById({ params: req.params });
    if (result.error) {
      return Utility.render(res, { success: false, msg: result.error });
    }
    return Utility.render(res, result);
  } catch (error) {
    return Utility.render(res, { success: false, msg: error });
  }
});

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     description: This api will delete user by its id.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
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
 *                   example: User deleted successfully.
 *       404:
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
 *                   example: User not founded or deleted unsuccessfully.
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
router.delete('/:userId', deleteUser, async (req, res) => {
  try {
    const result = await UserService.deleteUser({ params: req.params });
    if (result.error) {
      return Utility.render(res, { success: false, msg: result.error });
    }
    return Utility.render(res, result);
  } catch (error) {
    return Utility.render(res, { success: false, msg: error });
  }
});
module.exports = router;
