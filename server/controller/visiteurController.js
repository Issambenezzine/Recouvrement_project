const Visiteur = require("../models/Visiteur.js");
const { verifyEmail } = require("../services/verifyEmail.js");

const getVisiteur = async (req, res) => {
    const role = req.role
    if(role !== "ADMIN") {
        return res.status(401).send("Vous n'êtes pas autorisé")
    }
    try {
        const visiteurs = await Visiteur.findAll();
        res.status(200).json(visiteurs);
    } catch (err) {
        res.status(500).send(`Error getting Visiteurs : ${err.message}`);
    }
  }

const saveVisiteur = async (req, res) => {
    const role = req.role
    const { username, email, password, addresse, tel, activation } = req.body;
    
    if(role!=="ADMIN") {
        return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
    }

    if(await verifyEmail(email)) {
      return res.status(400).json({message:"Email est déjà enregistré"})
    }

    if (!username || !email || !password) {
        return res.status(400).send("Username, email, and password are required.");
    }
    
    try {
        const newVisiteur = await Visiteur.create({
        username,
        email,
        password,
        addresse,
        tel,
        activation
        });
        return res.status(201).json({ message: "Visiteur is successfully created" });
    } catch (error) {
        console.error("Error creating Visiteur:", error);
        return res.status(500).send("Internal server error.");
    }
}


const updateVisiteur = async (req, res) => {
  const { id } = req.body;
  const allowedFields = ["username", "email", "password", "tel", "addresse", "activation"];
  const updateData = {};
  const role = req.role
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
    await Visiteur.update(updateData, { where: { id } });
    res.status(200).json({ message: "Visiteur is successfully updated" });
  } catch (err) {
    res.status(500).send(`Error Updating Visiteur : ${err.message}`);
  }
};

const deleteVisiteur = async (req, res) => {
  const { id } = req.body;
  const role = req.role;
  console.log(role)
  if (role !== "ADMIN") {
    return res.status(401).send("Vous n'êtes pas autorisé");
  }
  try {
    await Visiteur.destroy({
      where: { id },
    });
    return res
      .status(200)
      .json({ message: "Visiteur is successfully deleted" });
  } catch (err) {
    console.log(err.message)
    return res.status(500).send(`Error deleting Visiteur: ${err.message}`);
  }
};

const getVisiteurData = async (req, res) => {
  try {
    const userId = req.user.id; // comes from the decoded token
    const role = req.role;
    if (role !== "VISITEUR") {
      return res.status(404).json({ message: "Not an Visiteur" });
    }
    const visit = await Visiteur.findByPk(userId); // or findById for Mongo

    if (!visit) {
      return res.status(404).json({ message: "Visiteur not found" });
    }

    res.json({
      id: visit.id,
      username: visit.username,
      email: visit.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
    saveVisiteur,
    updateVisiteur,
    deleteVisiteur,
    getVisiteurData
}