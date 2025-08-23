const express = require("express")
const route = express.Router()
const {saveGestionnaire, getGestionnaireForAffect,getGestionnairesByResponsable, blockGestionnaire, activerGestionnaire, deleteGestionnaire, updateGestionnaire, validerDossiers, getUsernameById} = require('../controller/gestionnaireController.js')
const { authorize } = require("../middlewares/auth.js")

/**
 * @swagger
 * tags:
 *   name: Gestionnaire
 *   description: Gestionnaire Management
 */

/**
 * @swagger
 * /gestionnaire/save:
 *   post:
 *     summary: Create a new Gestionnaire (ADMIN only)
 *     tags:
 *       - Gestionnaire
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
 *         description: Gestionnaire created successfully
 *       401:
 *         description: Unauthorized
 *       502:
 *         description: Error saving Gestionnaire
 */

/**
 * @swagger
 * /gestionnaire/block:
 *   put:
 *     summary: Block a Gestionnaire (ADMIN only)
 *     tags:
 *       - Gestionnaire
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
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gestionnaire not found
 *       500:
 *         description: Error blocking Gestionnaire
 */

/**
 * @swagger
 * /gestionnaire/active:
 *   put:
 *     summary: Activate a Gestionnaire (ADMIN only)
 *     tags:
 *       - Gestionnaire
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
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gestionnaire not found
 *       500:
 *         description: Error activating Gestionnaire
 */
/** 
 * @swagger
 * /gestionnaire/delete:
 *   delete:
 *     summary: Delete a Gestionnaire (ADMIN only)
 *     tags:
 *       - Gestionnaire
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
 *         description: Gestionnaire is successfully deleted
 *       401:
 *         Vous n'êtes pas autorisé
 *       500:
 *         Error deleting Gestionnaire
 */
/** 
* @swagger
* /gestionnaire/update:
 *   put:
 *     summary: update a Gestionnaire (ADMIN only)
 *     tags: 
 *       - Gestionnaire
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
 *         description: Gestionnaire updated successfully
 *       404:
 *         description: Gestionnaire not found
 *       500:
 *         description: Error activating Gestionnaire
*/

route.post('/save',authorize,saveGestionnaire)
route.delete("/delete",authorize,deleteGestionnaire)
route.put("/update", authorize, updateGestionnaire)
route.put('/block',authorize,blockGestionnaire)
route.put('/active',authorize,activerGestionnaire)
route.get('/get/:managerId',authorize,getGestionnairesByResponsable)
route.post("/valider",authorize,validerDossiers)
route.get("/getUsername/:id",getUsernameById)
route.get("/getGestionnaireForAffect",authorize,getGestionnaireForAffect)

module.exports = route