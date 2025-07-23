const Debiteur_Employeur = require("../models/Debiteur_Employeur.js");

const saveEmployeur = async (
  employeur,
  addresse,
  ville,
  employeur_tel1,
  employeur_tel2,
  debiteurId
) => {
  try {
    const debiteur_employeur = await Debiteur_Employeur.create({
      employeur,
      addresse,
      ville,
      employeur_tel1,
      employeur_tel2,
      debiteurId,
    });
    return debiteur_employeur
  } catch (err) {
    console.log("❌ Error saving employeur:", err.message);
    throw err;
  }
};

module.exports = {saveEmployeur}
