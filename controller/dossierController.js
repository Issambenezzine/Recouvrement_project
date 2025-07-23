const Dossier = require("../models/Dossier.js");

const saveDossier = async (
  NDossier,
  categorie,
  type,
  clientId,
  statusId,
  etat,
  debiteurId,
  creanceId,
  gestionnaireId
) => {
  try {
    const dossier = await Dossier.create({
      NDossier,
      categorie,
      type,
      etat,
      clientId,
      statusId,
      debiteurId,
      creanceId,
      gestionnaireId
    });

    console.log("✅ Dossier saved:", dossier.NDossier);
    return dossier; // ✅ return it
  } catch (err) {
    console.log("❌ Error saving Dossier:", err.message);
    throw err;
  }
};


module.exports = {saveDossier}