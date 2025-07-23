const express = require("express")
const route = express.Router()
const {getDossiersAgenda} = require("../controller/agendaController.js")
const { authorize } = require("../middlewares/auth.js")


/**
 * @swagger
 * tags:
 *   name: Agenda
 *   description: Dossiers agenda management
 */

/**
 * @swagger
 * /agenda/dossiers:
 *   get:
 *     summary: Get dossiers for agenda (requires authentication)
 *     tags: [Agenda]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of dossiers for the agenda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dossier:
 *                     type: object
 *                   client:
 *                     type: object
 *                   gestionnaire:
 *                     type: string
 *                   gestionnaireId:
 *                     type: integer
 *                   debiteurInfo:
 *                     type: object
 *                   nombre_dossier:
 *                     type: integer
 *                   creance:
 *                     type: object
 *                   timeline:
 *                     type: array
 *                     items:
 *                       type: object
 *                   encaissement:
 *                     type: array
 *                     items:
 *                       type: object
 *                   pieces:
 *                     type: array
 *                     items:
 *                       type: object
 *                   retraite:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: There is no dossiers !
 *       500:
 *         description: Error fetching dossiers
 */
route.get("/dossiers",authorize,getDossiersAgenda)


module.exports = route