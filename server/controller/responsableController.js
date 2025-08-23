const connection = require("../config/db.js");
const Responsable = require("../models/Responsable.js");
const UserLogs = require("../models/UserLogs.js");
const { fetchUsers } = require("./userController.js");
const {verifyEmail} = require("../services/verifyEmail.js");
const Gestionnaire = require("../models/Gestionnaire.js");
const Objectifs = require("../models/Objectifs.js");

const getResponsable = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).send("Vous n'êtes pas autorisé");
  }
  try {
    const responsables = await Responsable.findAll();
    res.status(200).json(responsables);
  } catch (err) {
    console.log(err.message)
    res.status(500).send(`Error getting Responsables : ${err.message}`);
  }
}

const saveResponsable = async (req, res) => {
  try {
    const role = req.role;
    const { username, email, password, tel, addresse, activation } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send("Username, email, and password are required.");
    }
    if (role !== "ADMIN") {
      return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
    }

    if(await verifyEmail(email)) {
      return res.status(400).json({message:"Email est déjà enregistré"})
    }

    const savedResponable = await Responsable.create({
      username,
      email,
      tel,
      password,
      activation,
      addresse,
    });
    if (!savedResponable) {
      res.status(502).send("Error saving responsable");
    }
    // const io = req.app.get("io");
    // const users = await fetchUsers();
    // io.emit("profiles", users);
    return res.status(200).json({ message: "responsable is successfully created" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error saving responsable : ${err.message}`);
  }
};

const updateResponsable = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).send("Vous n'êtes pas autorisé");
  }
  const allowedFields = [
    "username",
    "email",
    "password",
    "tel",
    "addresse",
    "activation",
  ];
  const updateData = {};
  for (const field of allowedFields) {
    if (
      req.body[field] !== undefined &&
      req.body[field] !== null &&
      req.body[field] !== ""
    ) {
      updateData[field] = req.body[field];
    }
  }
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }
  try {
    await Responsable.update(updateData, { where: { id } });
    res.status(200).json({ message: "Responsable is successfully updated" });
  } catch (err) {
    res.status(500).send(`Error Updating Responsable : ${err.message}`);
  }
};

const deleteResponsable = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  if (role !== "ADMIN") {
    res.status(401).send("Vous n'êtes pas autorisé");
  }
  try {
    await Responsable.destroy({
      where: { id },
    });

    
    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);

    // Loop through redisStructure and update all matching dossier IDs
    for (const dossier of redisDataParsed.redisStructure) {
      if (id == dossier.dossier.responsableId) {
        dossier.dossier = {
          ...dossier.dossier,
          responsableId: null,
        };
        dossier.manager = null;
      }
    }

    // Save back updated cache
    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

    return res
      .status(200)
      .json({ message: "Responsable is successfully deleted" });
  } catch (err) {
    return res.status(500).send(`Error deleting Responsable: ${err.message}`);
  }
};

const blockResponsable = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const [updated] = await Responsable.update(
      { activation: "Block" },
      { where: { id } }
    );
    const name = await Responsable.findOne({
      where: { id },
      attributes: ["username"],
    });
    if (updated === 0) {
      return res.status(404).json({ message: "Responsable not found" });
    }
    await UserLogs.create({
      user: name.username,
      userRole: "RESPONSABLE",
      action: "Banner",
      timestamp: new Date(),
    });
    return res.json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).send(`Error blocking Responsable : ${err.message}`);
  }
};

const activerResponsable = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const [updated] = await Responsable.update(
      { activation: "Active" },
      { where: { id } }
    );
    const name = await Responsable.findOne({
      where: { id },
      attributes: ["username"],
    });
    if (updated === 0) {
      return res.status(404).json({ message: "Gestionnaire not found" });
    }
    await UserLogs.create({
      user: name.username,
      userRole: "RESPONSABLE",
      action: "Autoriser",
      timestamp: new Date(),
    });
    return res.json({ message: "User updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .send(`Error activating Gestionnaire : ${err.message}`);
  }
};

const getResponsableData = async (req, res) => {
  try {
    const userId = req.user.id; // comes from the decoded token
    const role = req.role;
    if (role !== "RESPONSABLE") {
      return res.status(404).json({ message: "Not a Responsable" });
    }
    const responsable = await Responsable.findByPk(userId); // or findById for Mongo

    if (!responsable) {
      return res.status(404).json({ message: "Responsable not found" });
    }

    res.json({
      id: responsable.id,
      username: responsable.username,
      email: responsable.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



const getGestionGestionnaire = async (req, res) => {
  const role = req.role
  if(role !== "RESPONSABLE") {
    return res.status(401).json({ message: "Vous n'êtes pas autorise" });
  }
  try {
    const responsableId = req.params.responsableId;

    const results = await connection.query(
      `
      SELECT 
        g.username AS "gest",
        g.id as "id",
        g.objectif AS "obj",
        COUNT(DISTINCT d.id) AS "nbr_dossier",
        COUNT(a.id) AS "nbr_action"
      FROM prc.gestionnaire g
      JOIN prc.dossier d ON d.gestionnaireId = g.id
      LEFT JOIN prc.action a ON a.dossierId = d.id
      WHERE g.responsableId = :responsableId
      GROUP BY g.username, g.objectif, g.id
      ORDER BY g.username
      `,
      {
        replacements: { responsableId },
        type: connection.QueryTypes.SELECT,
      }
    );

    // Ensure it's always an array
    res.status(200).json(Array.isArray(results) ? results : [results]);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
};


const modifyObjectif = async(req,res) => {
    const role = req.role
    if(role !== "RESPONSABLE") {
      return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
    }
    try {
      const { id, objectif,username } = req.body;
      await Gestionnaire.update({ objectif }, { where: { id } });
      await Objectifs.create({ newObjectif: objectif, gestionnaireId: id, nom: username });
      return res.status(200).json({ message: "Objectif modifié avec succès" });
    }catch(err) {
      console.log(err.message)
      return res.status(500).send(`Error modifying objectif : ${err.message}`)
    }
}


const getMyGestionnaires = async (req, res) => {};

module.exports = {
  saveResponsable,
  updateResponsable,
  deleteResponsable,
  blockResponsable,
  activerResponsable,
  getResponsableData,
  getResponsable,
  getGestionGestionnaire,
  modifyObjectif
};
