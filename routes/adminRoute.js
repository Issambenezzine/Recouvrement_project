const express = require("express")
const router = express.Router()
const { authorize } = require("../middlewares/auth.js")
const { saveAdmin } = require("../controller/adminController.js")

router.post('/save',authorize,saveAdmin)

module.exports = router


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */


/**
 * @swagger
 * /admin/save:
 *   post:
 *     summary: Create a new admin (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               tel:
 *                 type: string
 *               addresse:
 *                 type: string
 *               activation:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Admin created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Responsable'
 *       401:
 *         description: Unauthorized
 *       502:
 *         description: Error saving Admin
 */