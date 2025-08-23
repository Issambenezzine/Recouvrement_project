const express = require('express');
const router = express.Router();
const {importData} = require("../controller/importController.js")
const {importCadrage} = require("../controller/importCadrageController.js")


router.post('/data',importData);
router.post('/cadrage',importCadrage)

module.exports = router;




/**
 * @swagger
 * tags:
 *   name: Import
 *   description: Import Excel data into the database
 */

/**
 * @swagger
 * /import/data:
 *   post:
 *     summary: Import Excel data to the database (ADMIN only)
 *     tags: [Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 description: Array of objects representing Excel rows
 *                 items:
*                   type: object
*                   properties:
*                     N°Dossier:
*                       type: string
*                     Catégorie:
*                       type: string
*                     Capital:
*                       type: number
*                     Créance:
*                       type: number
*                     IntRetard:
*                       type: number
*                     Autres frais:
*                       type: number
*                     Total:
*                       type: number
*                     Durée:
*                       type: number
*                     Mensualité:
*                       type: number
*                     Date Première Échéance:
*                       type: string
*                     Date Dernière Échéance:
*                       type: string
*                     Date Contentieux:
*                       type: string
*                     Type PI:
*                       type: string
*                     Débiteur N°CIN:
*                       type: string
*                     Débiteur:
*                       type: string
*                     Débiteur Date Naissance:
*                       type: string
*                     Débiteur Profession:
*                       type: string
*                     Débiteur Adresse:
*                       type: string
*                     Débiteur Ville:
*                       type: string
*                     Débiteur N°Tél 1:
*                       type: string
*                     Débiteur N°Tél 2:
*                       type: string
*                     Employeur:
*                       type: string
*                     Employeur Adresse:
*                       type: string
*                     Employeur Ville:
*                       type: string
*                     Employeur N°Tél 1:
*                       type: string
*                     Employeur N°Tél 2:
*                       type: string
*                     Cautionneur N°CIN:
*                       type: string
*                     Cautionneur:
*                       type: string
*                     Cautionneur Adresse:
*                       type: string
*                     Cautionneur Ville:
*                       type: string
*                     Cautionneur N°Tél 1:
*                       type: string
*                     Cautionneur N°Tél 2:
*                       type: string
*                     Conjoint N°CIN:
*                       type: string
*                     Conjoint Nom:
*                       type: string
*                     Conjoint Adresse:
*                       type: string
*                     Conjoint Ville:
*                       type: string
*                     Conjoint N°Tél 1:
*                       type: string
*                     Conjoint N°Tél 2:
*                       type: string
*                     ID Gestionnaire:
*                       type: string
*                     Commentaire gestionnaire:
*                       type: string
*                     Commentaire responsable:
*                       type: string
*                     Autre:
*                       type: string
 *               repartitionAutomatique:
 *                 type: integer
 *                 description: 1 for automatic repartition, 0 for manual
 *               manager:
 *                 type: string
 *               lot:
 *                 type: number
 *               length:
 *                 type: number
 *               client:
 *                 type: number
 *     responses:
 *       201:
 *         description: Data imported successfully
 *         content:
 *           application/json:
 *             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   Gestionnaire:
*                     type: string
*                   dossiers:
*                     type: integer
*                     nullable: true
*                   creance:
*                     type: number
*                     nullable: true
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
