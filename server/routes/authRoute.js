const express = require("express");
const route = express.Router();

const {
  login_post,
  logout,
} = require("../controller/authController.js");

const {
  getGestionnairesData,
} = require("../controller/gestionnaireController.js");

const {
  authorize,
} = require("../middlewares/auth.js");

const {getAdminData} = require("../controller/adminController.js");
const { getResponsableData } = require("../controller/responsableController.js");
const { getVisiteurData } = require("../controller/visiteurController.js");

// Routes
route.post("/login", login_post);
route.post("/logout",authorize,logout)

// ✅ Middleware + Controller both must be valid functions
route.get("/gestionnaire", authorize, getGestionnairesData);
route.get("/admin",authorize,getAdminData)
route.get("/responsable",authorize,getResponsableData)
route.get("/visiteur",authorize, getVisiteurData)

module.exports = route;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user role endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: User logout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/gestionnaire:
 *   get:
 *     tags: [Auth]
 *     summary: Get gestionnaire dashboard data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/admin:
 *   get:
 *     tags: [Auth]
 *     summary: Get admin data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not an Admin
 */

/**
 * @swagger
 * /auth/responsable:
 *   get:
 *     tags: [Auth]
 *     summary: Get responsable data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Responsable data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not a Responsable
 */

