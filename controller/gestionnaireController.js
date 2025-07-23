const Gestionnaire = require("../models/Gestionnaire.js");
const Responsable = require("../models/Responsable.js");
const UserLogs = require("../models/UserLogs.js");
const {fetchUsers} = require("./userController.js")

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


const saveGestionnaire = async (req, res) => {
  const role = req.role;
  const { username, email, password, tel, addresse, activation } = req.body;
  try {
    console.log(role);
    if (role !== "ADMIN") {
      return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
    }
    const gestionnaire = await Gestionnaire.create({
      username,
      email,
      password,
      tel,
      addresse,
      activation,
    });
    if (!gestionnaire) {
      return res.status(502).send("Error saving Gestionnaire");
    }
    const io = req.app.get("io");
    const users = await fetchUsers();
    io.emit("profiles", users);
    return res.status(200).json(gestionnaire);
  } catch (err) {
    return res.status(500).send(`Error saving Gestionnaire : ${err.message}`);
  }
};

const deleteGestionnaire = async (req, res) => {
  const { id } = req.body;
  const role = req.body;
  if (role !== "ADMIN") {
    return res.status(401).send("Vous n'êtes pas autorisé");
  }
  try {
    await Gestionnaire.destroy({
      where: { id },
    });
    const io = req.app.get("io");
    const users = await fetchUsers();
    io.emit("profiles", users);
    return res
      .status(200)
      .json({ message: "Gestionnaire is successfully deleted" });
  } catch (err) {
    return res.status(500).send(`Error deleting Gestionnaire: ${err.message}`);
  }
};

const updateGestionnaire = async (req, res) => {
  const { id } = req.body;
  const allowedFields = ["username", "email", "password", "tel", "addresse", "activation"];
  const updateData = {};
  const role = req.body
  if(role !== "ADMIN") {
    return res.status(401).send("Vous n'êtes pas autorisé")
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
    res.status(200).json({ message: "Gestionnaire is successfully updated" });
  } catch (err) {
    res.status(500).send(`Error Updating Gestionnaire : ${err.message}`);
  }
};

const getGestionnairesId = async () => {
  try {
    const gestionnaires = await Gestionnaire.findAll({
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

const getGestionnairesData = async (req, res) => {
  try {
    const userId = req.user.id; // comes from the decoded token
    const role = req.role;

    if (role !== "GESTIONNAIRE") {
      return res.status(401).json({ message: "Not a Gestionnaire" });
    }
    const gestionnaire = await Gestionnaire.findByPk(userId); // or findById for Mongo

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

module.exports = {
  blockGestionnaire,
  saveGestionnaire,
  getGestionnairesId,
  getGestionnairesData,
  activerGestionnaire,
  deleteGestionnaire,
  fetchUsers,
  updateGestionnaire
};
