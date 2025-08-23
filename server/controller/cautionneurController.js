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


const getCautionneur = async (req,res) => {
  try {
    const debiteurId = req.params.debiteurId;
    const debiteur_cautionneur = await Debiteur_Cautionneur.findAll({
      where: { debiteurId },
    });
    return res.status(200).send(debiteur_cautionneur)
  } catch (err) {
    console.log("Error in controller/cautionneurController/getCautionneur: ",err.message)
    return res.status(500).json({message: err.message})
  }
}

module.exports = {
  getCautionneur
}
