const Debiteur_Employeur = require("../models/Debiteur_Employeur.js");
const Debiteur_Employeur_Cadrage = require("../models/Debiteur_Employeur_Cadrage.js");

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

const getEmployeur = async (req,res) => {
  try {
    const debiteurId = req.params.debiteurId;
    const debiteur_employeur = await Debiteur_Employeur.findAll({
      where: { debiteurId },
    });
    return res.status(200).send(debiteur_employeur)
  } catch (err) {
    console.log("Error in controller/employeurController/getEmployeur:",err.message)
    return res.status(500).json({message: err.message})
  }
}

const getEmployeurCadrage = async(req,res) => {
  try {
    const {debiteurId,marche} = req.body
    const employeurs = await Debiteur_Employeur_Cadrage.findAll({
      where :{debiteurId:debiteurId,marche:marche}
    })
    return res.status(200).send(employeurs)
  }catch(err) {
    console.log(err.message)
    return res.status(500).json({message: err.message})
  }
}

module.exports = {saveEmployeur,getEmployeur,getEmployeurCadrage}
