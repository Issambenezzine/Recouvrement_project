// const Archive = require("../models/Archive.js");
const Gestionnaire = require("../models/Gestionnaire.js");
const Responsable = require("../models/Responsable.js");
const UserLogs = require("../models/UserLogs.js");
const { fetchUsers } = require("./userController.js");
const Dossier = require("../models/Dossier.js");
const Admin = require("../models/Admin.js");
const { fetchDossiersAgenda } = require("./agendaController.js");
const { verifyEmail } = require("../services/verifyEmail.js");
const Objectifs = require("../models/Objectifs.js");
const redisClient = require("../config/redis.js");
const { punchStatistics } = require("./pilotageCommissionController.js");
// const getGestionnaires = async(req,res) => {
//   const role = req.role
//   if(role !== "ADMIN") {
//     return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
//   }
//   try {
//     const gestionnai
//   }catch(err) {
//     return res.status(500).send(`Error fetching Gestionnaires: ${err.message}`)
//   }
// }

// This function is an asynchronous function that saves a Gestionnaire to the database

const redisKey = "2002_KAFKA";

const saveGestionnaire = async (req, res) => {
  // Get the role from the request
  const role = req.role;
  // Get the username, email, password, tel, addresse, and activation from the request body
  const {
    username,
    email,
    password,
    tel,
    addresse,
    objectif,
    activation,
    responsableId,
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Username, email, and password are required.");
  }
  try {
    // Log the role
    console.log(role);
    // If the role is not "ADMIN", return a 401 status code with a message
    if (role !== "ADMIN") {
      return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
    }

    if (await verifyEmail(email)) {
      return res.status(400).json({ message: "Email est déjà enregistré" });
    }
    const gestionnaire = await Gestionnaire.create({
      username,
      email,
      password,
      tel,
      addresse,
      objectif,
      activation,
      responsableId,
    });
    await Objectifs.create({
      newObjectif: objectif,
      gestionnaireId: gestionnaire.id,
      nom: username,
    });
    // If the Gestionnaire is not created, return a 502 status code with a message
    if (!gestionnaire) {
      return res.status(502).send("Error saving Gestionnaire");
    }
    // Return a 200 status code with the Gestionnaire
    return res
      .status(200)
      .json({ message: "Gestionnaire is successfully created" });
  } catch (err) {
    // Log the error message
    console.log(err.message);
    // Return a 500 status code with the error message
    return res.status(500).send(`Error saving Gestionnaire : ${err.message}`);
  }
};

const deleteGestionnaire = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  console.log(role);
  if (role !== "ADMIN") {
    return res.status(401).send("Vous n'êtes pas autorisé");
  }
  try {
    await Gestionnaire.destroy({
      where: { id },
    });

    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);

    // Loop through redisStructure and update all matching dossier IDs
    for (const dossier of redisDataParsed.redisStructure) {
      if (id == dossier.dossier.gestionnaireId) {
        dossier.dossier = {
          ...dossier.dossier,
          gestionnaireId: null,
        };
        dossier.gestionnaire = null;
        dossier.gestionnaireId = null;
      }
    }

    // Save back updated cache
    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

    const admineIds = await Admin.findAll({
      where: {},
      attributes: ["id"],
    }).then((results) => results.map((g) => ({ id: g.id })));

    for (const id of admineIds) {
      let updatedDossiersAdmin = await fetchDossiersAgenda(id, "ADMIN");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersAdmin,
        id: id,
        role: "ADMIN",
      });
    }

    return res
      .status(200)
      .json({ message: "Gestionnaire is successfully deleted" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error deleting Gestionnaire: ${err.message}`);
  }
};

const updateGestionnaire = async (req, res) => {
  const { id } = req.body;
  const allowedFields = [
    "username",
    "email",
    "password",
    "tel",
    "objectif",
    "addresse",
    "activation",
    "responsableId",
  ];
  const updateData = {};
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).send("Vous n'êtes pas autorisé");
  }
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
    await Gestionnaire.update(updateData, { where: { id } });
    await Dossier.update(
      { responsableId: updateData.responsableId },
      { where: { gestionnaireId: id } }
    );
    await Objectifs.create({
      newObjectif: updateData.objectif,
      gestionnaireId: id,
      nom: updateData.username,
    });

    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);

    // Loop through redisStructure and update all matching dossier IDs
    for (const dossier of redisDataParsed.redisStructure) {
      if (id == dossier.dossier.gestionnaireId) {
        dossier.dossier = {
          ...dossier.dossier,
          responsableId: updateData.responsableId,
        };
      }
    }

    // Save back updated cache
    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

    res.status(200).json({ message: "Gestionnaire is successfully updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(`Error Updating Gestionnaire : ${err.message}`);
  }
};

const getGestionnairesId = async (mangerId) => {
  try {
    const gestionnaires = await Gestionnaire.findAll({
      where: { responsableId: mangerId },
      attributes: ["id", "username"],
    }).then((results) => results.map((g) => ({ id: g.id, name: g.username })));
    if (!gestionnaires) {
      return "Error fetching Gestionnaires";
    }
    console.log(gestionnaires);
    return gestionnaires;
  } catch (err) {
    console.log(`Error fetching Gestionnaires IDs: ${err.message}`);
  }
};

const getGestionnairesByResponsable = async (req, res) => {
  const role = req.role;
  const { managerId } = req.params;
  if (role !== "ADMIN" && role !== "RESPONSABLE") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const gestionnaires = await Gestionnaire.findAll({
      where: { responsableId: managerId },
      attributes: ["id", "username"],
    }).then((results) => results.map((g) => ({ id: g.id, name: g.username })));
    if (!gestionnaires) {
      return res.status(400).send("Error fetching Gestionnaires");
    }
    console.log(gestionnaires);
    return res.status(200).send(gestionnaires);
  } catch (err) {
    return res
      .status(500)
      .send(`Error fetching Gestionnaires IDs: ${err.message}`);
  }
};

const getGestionnairesData = async (req, res) => {
  try {
    const userId = req.user.id; // comes from the decoded token
    const role = req.role;

    if (role !== "GESTIONNAIRE") {
      return res.status(401).json({ message: "Not a Gestionnaire" });
    }
    const gestionnaire = await Gestionnaire.findByPk(userId);

    if (!gestionnaire) {
      return res.status(404).json({ message: "Gestionnaire not found" });
    }

    res.json({
      id: gestionnaire.id,
      username: gestionnaire.username,
      email: gestionnaire.email,
      tel: gestionnaire.tel,
      dateEmb: gestionnaire.dateEmb,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const blockGestionnaire = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const [updated] = await Gestionnaire.update(
      { activation: "Block" },
      { where: { id } }
    );
    const name = await Gestionnaire.findOne({
      where: { id },
      attributes: ["username"],
    });
    if (updated === 0) {
      return res.status(404).json({ message: "Gestionnaire not found" });
    }
    await UserLogs.create({
      user: name.username,
      userRole: "GESTIONNAIRE",
      action: "Banner",
      timestamp: new Date(),
    });
    return res.json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).send(`Error blocking Gestionnaire : ${err.message}`);
  }
};

const activerGestionnaire = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const [updated] = await Gestionnaire.update(
      { activation: "Active" },
      { where: { id } }
    );
    const name = await Gestionnaire.findOne({
      where: { id },
      attributes: ["username"],
    });
    if (updated === 0) {
      return res.status(404).json({ message: "Gestionnaire not found" });
    }
    await UserLogs.create({
      user: name.username,
      userRole: "GESTIONNAIRE",
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

const validerDossiers = async (req, res) => {
  const role = req.role;

  if (role !== "GESTIONNAIRE") {
    return res.status(401).send(" ");
  }
  try {
    const { idGest } = req.body;
    console.log("idGest : ", idGest);
    const idRepo = await Gestionnaire.findAll({ where: { id: idGest } }).then(
      (results) => results.map((d) => d.responsableId)
    );

    console.log("Id respo : ", idRepo);
    const dossiers = await Dossier.findAll({
      where: { gestionnaireId: idGest, etat: "Nouvelles actions" },
      attributes: ["id"],
    }).then((results) => results.map((d) => d.id));
    if (dossiers.length === 0) {
      console.log("checked");
      return res.status(400).json({ message: "Aucun Dossier trouvé !" });
    }
    console.log("dossier length : ", dossiers.length);
    for (const dossier of dossiers) {
      await Dossier.update(
        { etat: "Action à traiter", etatResponsable: "Action à traiter" },
        { where: { id: dossier } }
      );
    }
    const io = req.app.get("io");
    const admineIds = await Admin.findAll({
      where: {},
      attributes: ["id"],
    }).then((results) => results.map((g) => ({ id: g.id })));

    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);
    const dossiersUpdted = redisDataParsed.redisStructure.filter(
      (d) => d.dossier.gestionnaireId == idGest // use == to handle number/string mismatch
    );

    for (const dossier of dossiersUpdted) {
      if (dossier && dossier.dossier.etat === "Nouvelles actions") {
        // Add new property or push into array
        dossier.dossier = {
          ...dossier.dossier,
          etat: "Action à traiter",
          etatResponsable: "Action à traiter",
        };
      }
    }
    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

    for (const id of admineIds) {
      let updatedDossiersAdmin = await fetchDossiersAgenda(id.id, "ADMIN");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersAdmin,
        id: id.id,
        role: "ADMIN",
      });
    }
    const updatedDossiersRespo = await fetchDossiersAgenda(
      idRepo.responsableId,
      "RESPONSABLE"
    );
    io.emit("dossiersAgendaData", {
      dossiers: updatedDossiersRespo,
      id: idRepo.responsableId,
      role: "RESPONSABLE",
    });
    const updatedDossiersGest = await fetchDossiersAgenda(
      idGest,
      "GESTIONNAIRE"
    );
    io.emit("dossiersAgendaData", {
      dossiers: updatedDossiersGest,
      id: idGest,
      role: "GESTIONNAIRE",
    });

    let statis = await punchStatistics();
    io.emit("plotage_commission", statis);
    return res.status(200).json({ message: "Dossiers validés avec succès !" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error validating Dossiers : ${err.message}`);
  }
};

const getUsernameById = async (req, res) => {
  try {
    const gestionnaire = await Gestionnaire.findOne({
      where: { id: req.params.id },
      attributes: ["username"],
    });
    if (!gestionnaire) {
      return res.status(404).json({ message: "Gestionnaire not found" });
    }
    return res.status(200).json({ username: gestionnaire.username });
  } catch (err) {
    return res.status(500).send(`Error getting username : ${err.message}`);
  }
};

const getGestionnaireForAffect = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes paas autorisé" });
  }
  try {
    const gestionnaires = await Gestionnaire.findAll({
      attributes: ["id", "username"],
    });
    return res.status(200).json(gestionnaires);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error getting username : ${err.message}`);
  }
};

module.exports = {
  blockGestionnaire,
  saveGestionnaire,
  getGestionnairesId,
  getGestionnairesData,
  activerGestionnaire,
  deleteGestionnaire,
  fetchUsers,
  updateGestionnaire,
  getGestionnairesByResponsable,
  validerDossiers,
  getUsernameById,
  getGestionnaireForAffect,
};
