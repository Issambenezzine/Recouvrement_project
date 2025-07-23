const Admin = require("../models/Admin.js")

const saveAdmin = async (req,res) => {
  const role = req.role 
  const {username,email,password,tel,addresse,activation} = req.body
  try {
    if(role !== "ADMIN") {
      return res.status(401).json({message: "Vous n'êtes pas autorisé"})
    }
    await Admin.create({
      username,
      email,
      password,
      activation,
      tel,
      addresse
    });
  } catch (err) {
    return res.status(500).send(`Error saving Admin : ${err.message}`);
  }
};

const getAdminData = async(req,res) => {
    try {
    const userId = req.user.id; // comes from the decoded token
    const role = req.role
    if(role!=="ADMIN") {
      return res.status(404).json({message:"Not an Admin"})
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
}

module.exports = {saveAdmin, getAdminData}