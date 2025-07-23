const Debiteur_Cautionneur = require("../models/Debiteur_Cautionneur.js");

module.exports.saveCautionneur = async (
  CIN,
  nom,
  addresse,
  ville,
  cautionneurTel1,
  cautionneurTel2,
  debiteurId
) => {
  try {
    const cautionneur = await Debiteur_Cautionneur.create({
      CIN,
      nom,
      addresse,
      ville,
      cautionneurTel1,
      cautionneurTel2,
      debiteurId,
    });
    return cautionneur
  } catch (err) {
    console.log(`Error saving cautionneur : ${err.message}`);
  }
};
