const Admin = require("../models/Admin");
const Gestionnaire = require("../models/Gestionnaire");
const Responsable = require("../models/Responsable");
const Visiteur = require("../models/Visiteur");

const verifyEmail = async (email) => {
  if (!email) return false;

  let profile = await Admin.findOne({ where: { email } });
  if (profile) return true;

  profile = await Visiteur.findOne({ where: { email } });
  if (profile) return true;

  profile = await Responsable.findOne({ where: { email } });
  if (profile) return true;

  profile = await Gestionnaire.findOne({ where: { email } });
  if (profile) return true;

  return false; // No match in any model
};



module.exports = {verifyEmail};

