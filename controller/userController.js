const Gestionnaire = require("../models/Gestionnaire.js");
const Responsable = require("../models/Responsable.js");
const UserLogs = require("../models/UserLogs.js");

const fetchUsers = async (req,res) => {
  const role = req.role
  if(role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const gestionnairesRaw = await Gestionnaire.findAll();
    const responsablesRaw = await Responsable.findAll();
    const gestionnaires = gestionnairesRaw.map((g) => g.get({ plain: true }));
    const responsables = responsablesRaw.map((r) => r.get({ plain: true }));
    gestionnaires.forEach(g => g.role = "GESTIONNAIRE");
    responsables.forEach(r => r.role = "RESPONSABLE");
    const allUsers = [...gestionnaires, ...responsables];
    allUsers.sort((a, b) => a.username.localeCompare(b.username));
    return res.status(200).json(allUsers);
  } catch (err) {
    return res.status(500).send(`Error fetching Users ${err.message}`);
  }
};

module.exports = { fetchUsers };
