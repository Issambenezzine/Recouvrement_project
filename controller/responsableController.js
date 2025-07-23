const Responsable = require("../models/Responsable.js");
const UserLogs = require("../models/UserLogs.js")
const {fetchUsers} = require("./userController.js")

const saveResponsable = async (req, res) => {
  const  role  = req.role;
  const { username, email, password, tel, addresse, activation } = req.body;
  try {
     if(role !== "ADMIN") {
      return res.status(401).json({message: "Vous n'êtes pas autorisé"})
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
    const io = req.app.get("io");
    const users = await fetchUsers();
    io.emit("profiles", users);
    return res.status(200).json(savedResponable);
  } catch (err) {
    return res.status(500).send(`Error saving responsable : ${err.message}`);
  }
};

const updateResponsable = async (req, res) => {
  const { id } = req.body;
  const allowedFields = ["username", "email", "password", "tel", "addresse", "activation"];
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

const deleteResponsable = async(req,res) => {
  const {id} = req.body
  const role = req.body
  if(role!=="ADMIN") {
    res.status(401).send("Vous n'êtes pas autorisé")
  }
  try {
    await Responsable.destroy({
      where: {id}
    })
    const io = req.app.get("io");
    const users = await fetchUsers();
    io.emit("profiles", users);
    return res.status(200).json({message:"Responsable is successfully deleted"})
  }catch(err) {
    return res.status(500).send(`Error deleting Responsable: ${err.message}`)
  }
}


const blockResponsable = async (req, res) => {
  const {id } = req.body;
  const role = req.role
  if(role !== "ADMIN") {
    return res.status(401).json({message:"Vous n'êtes pas autorisé"})
  }
  try {
    const [updated] = await Responsable.update(
      { activation:"Block" },
      { where: { id } }
    );
    const name = await Responsable.findOne({where:{id},attributes:["username"]})
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
  const {id } = req.body;
  const role = req.role
  if(role !== "ADMIN") {
    return res.status(401).json({message:"Vous n'êtes pas autorisé"})
  }
  try {
    const [updated] = await Responsable.update(
      { activation:"Active" },
      { where: { id } }
    );
    const name = await Responsable.findOne({where:{id},attributes:["username"]})
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
    return res.status(500).send(`Error activating Gestionnaire : ${err.message}`);
  }
};

const getResponsableData = async(req,res) => {
    try {
    const userId = req.user.id; // comes from the decoded token
    const role = req.role
    if(role!=="RESPONSABLE") {
      return res.status(404).json({message:"Not a Responsable"})
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
}


const getMyGestionnaires = async (req, res) => {};

module.exports = { saveResponsable, updateResponsable, deleteResponsable, blockResponsable, activerResponsable, getResponsableData};
