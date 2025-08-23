const Gestionnaire = require("../models/Gestionnaire.js");
const Responsable = require("../models/Responsable.js");
const UserLogs = require("../models/UserLogs.js");
const Visiteur = require("../models/Visiteur.js");
const Admin = require("../models/Admin.js");
const { Op } = require("sequelize");
const connection = require("../config/db.js");
const { QueryTypes } = require("sequelize");

const fetchUsers = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN" && role !== "VISITEUR") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const id = req.params.id;
    const gestionnairesRaw = await Gestionnaire.findAll();
    const responsablesRaw = await Responsable.findAll();
    const visiteursRaw = await Visiteur.findAll();
    const adminRaw = await Admin.findAll({
      where: {
        id: {
          [Op.ne]: id,
        },
      },
    });
    const gestionnaires = gestionnairesRaw.map((g) => g.get({ plain: true }));
    const responsables = responsablesRaw.map((r) => r.get({ plain: true }));
    const visiteurs = visiteursRaw.map((v) => v.get({ plain: true }));
    const admins = adminRaw.map((a) => a.get({ plain: true }));
    gestionnaires.forEach((g) => (g.role = "GESTIONNAIRE"));
    responsables.forEach((r) => (r.role = "RESPONSABLE"));
    visiteurs.forEach((v) => (v.role = "VISITEUR"));
    admins.forEach((a) => (a.role = "ADMIN"));
    const allUsers = [
      ...gestionnaires,
      ...responsables,
      ...visiteurs,
      ...admins,
    ];
    allUsers.sort((a, b) => a.username.localeCompare(b.username));
    return res.status(200).json(allUsers);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error fetching Users ${err.message}`);
  }
};

const rechercheRapide = async (req, res) => {
  const search = req.params.search;
  if (!search) {
    return res.status(400).json({ message: "Invalid search query" });
  }
  if (search.trim() === "") {
    res.json([]);
  }
  try {
    const rows = await connection.query(
      `
        SELECT client.marche as client, debiteur.nom as debiteur, debiteur.CIN as piece, gestionnaire.username as gestionnaire
        FROM debiteur 
        INNER JOIN dossier on debiteur.CIN = dossier.debiteurId
        INNER JOIN client on dossier.clientId = client.id
        INNER JOIN gestionnaire on dossier.gestionnaireId = gestionnaire.id
        WHERE debiteur.CIN LIKE :search OR debiteur.nom LIKE :search
      `,
      {
        replacements: { search: `%${search.trim()}%` },
        type: QueryTypes.SELECT,
      }
    );
    res.json(rows);
  } catch (err) {
    return res.status(500).send(`Error Searching : ${err.message}`);
  }
};

module.exports = { fetchUsers, rechercheRapide };
