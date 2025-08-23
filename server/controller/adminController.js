const Admin = require("../models/Admin.js");
const connection = require("../config/db.js");
const {verifyEmail} = require("../services/verifyEmail.js")

const saveAdmin = async (req, res) => {
  const role = req.role;
  const { username, email, password, tel, addresse, activation } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Username, email, and password are required.");
  }
  try {
    if (role !== "ADMIN") {
      return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
    }

    if(await verifyEmail(email)) {
      return res.status(400).json({message:"Email est déjà enregistré"})
    }

    await Admin.create({
      username,
      email,
      password,
      activation,
      tel,
      addresse,
    });

    return res.status(200).json({ message: "Admin is successfully created" });

  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error saving Admin : ${err.message}`);
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  console.log(role);
  if (role !== "ADMIN") {
    return res.status(401).send("Vous n'êtes pas autorisé");
  }
  try {
    await Admin.destroy({
      where: { id },
    });
    return res.status(200).json({ message: "Admin is successfully deleted" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error deleting Admin: ${err.message}`);
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.body;
  const allowedFields = [
    "username",
    "email",
    "password",
    "tel",
    "addresse",
    "activation",
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
    await Admin.update(updateData, { where: { id } });
    res.status(200).json({ message: "Admin is successfully updated" });
  } catch (err) {
    res.status(500).send(`Error Updating Admin : ${err.message}`);
  }
};

const getAdminData = async (req, res) => {
  try {
    const userId = req.user.id; // comes from the decoded token
    const role = req.role;
    if (role !== "ADMIN") {
      return res.status(404).json({ message: "Not an Admin" });
    }
    const admin = await Admin.findByPk(userId); // or findById for Mongo

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getGesionDossier = async (req, res) => {
  // const role = req.role;
  // if (role !== "ADMIN") {
  //   return res.status(401).send("Vous n'êtes pas autorisé");
  // }
  try {
    const [results, metadata] = await connection.query(`
     SELECT 
  gestionnaire.id AS ID,   
  gestionnaire.username AS Gestionnaire,
  responsable.username AS Manager,
  COUNT(*) AS dossiers,
  SUM(creance.creance) AS TOTAL
FROM (
  SELECT * FROM prc.dossier
) AS last_dossiers
INNER JOIN prc.gestionnaire ON last_dossiers.gestionnaireId = gestionnaire.id 
INNER JOIN prc.responsable ON gestionnaire.responsableId = responsable.id
INNER JOIN prc.creance ON creance.id = last_dossiers.creanceId  
GROUP BY 
  gestionnaire.username,
  gestionnaire.id,
  responsable.username;

    `);
    const grouped = Object.values(
      results.reduce((acc, curr) => {
        const manager = curr.Manager;
        if (!acc[manager]) {
          acc[manager] = {
            manager: manager,
            stats: [],
          };
        }
        acc[manager].stats.push(curr);
        return acc;
      }, {})
    );
    return res.status(200).json(grouped);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  saveAdmin,
  getAdminData,
  deleteAdmin,
  updateAdmin,
  getGesionDossier,
};
