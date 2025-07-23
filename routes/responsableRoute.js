const express = require("express")
const router = express.Router()
const {saveResponsable, blockResponsable, activerResponsable, deleteResponsable, updateResponsable} = require("../controller/responsableController.js")
const { authorize } = require("../middlewares/auth.js")

router.post('/save',authorize,saveResponsable)
router.delete("/delete",authorize,deleteResponsable)
router.put("/update", authorize,updateResponsable)
router.put('/block',authorize,blockResponsable)
router.put('/active',authorize,activerResponsable)

module.exports = router



/**
 * @swagger
 * tags:
 *   name: Responsable
 *   description: Responsable management
 */

/**
 * @swagger
 * /responsable/save:
 *   post:
 *     summary: Create a new responsable (ADMIN only)
 *     tags: [Responsable]
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
 *         description: Responsable created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Responsable'
 *       401:
 *         description: Unauthorized
 *       502:
 *         description: Error saving responsable
 *
 * /responsable/block:
 *   put:
 *     summary: Block a responsable (ADMIN only)
 *     tags: [Responsable]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: Responsable not found
 *       500:
 *         description: Error blocking Responsable
 *
 * /responsable/active:
 *   put:
 *     summary: Activate a responsable (ADMIN only)
 *     tags: [Responsable]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: Responsable not found
 *       500:
 *         description: Error activating Responsable
 * /responsable/update:
 *   put:
 *     summary: Activate a responsable (ADMIN only)
 *     tags: [Responsable]
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
 *     responses:
 *       200:
 *         description: Responsable updated successfully
 *       404:
 *         description: Responsable not found
 *       500:
 *         description: Error activating Responsable
 * /responsable/delete:
 *   delete:
 *     summary: Delete a Responsable (ADMIN only)
 *     tags:
 *       - Responsable
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Responsable is successfully deleted
 *       500:
 *         Error deleting Responsable
 */