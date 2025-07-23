const express = require("express")
const { fetchUsers } = require("../controller/userController")
const { authorize } = require("../middlewares/auth")
const router = express.Router()


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Get all users (ADMIN ONLY)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   dateEmb:
 *                     type: Date
 *                   tel:
 *                     type: string
 *                   addresse:
 *                     type: string
 *                   activation:
 *                     type: string
 *                   role :
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/users",authorize,fetchUsers)

module.exports = router
