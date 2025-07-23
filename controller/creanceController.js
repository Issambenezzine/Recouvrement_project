const Creance = require("../models/Creance.js");
const moment = require("moment");
const Dossier = require("../models/Dossier.js");

const saveCreance = async (
  capital,
  creance,
  intRetard,
  autreFrais,
  date1Echeance,
  date2Echeance,
  dateContentieux,
  duree,
  mensualite
) => {
  try {
    const date1EcheanceF = moment(date1Echeance, "DD/MM/YYYY").toDate();
    const date2EcheanceF = moment(date2Echeance, "DD/MM/YYYY").toDate();
    const dateContentieuxF = moment(dateContentieux, "DD/MM/YYYY").toDate();
    const newCreance = await Creance.create({
      capital,
      creance,
      intRetard,
      autreFrais,
      date1Echeance: date1EcheanceF, // use the formatted date here
      dateDEcheance: date2EcheanceF,
      dateContentieux: dateContentieuxF,
      duree,
      mensualite,
    });

    console.log("✅ Creance saved:", newCreance.id);
    return newCreance; // ✅ return it
  } catch (err) {
    console.log("❌ Error saving Creance:", err.message);
    throw err; // to catch it in saveDossiers
  }
};

const sendCreances = async(req,res) => {
  try{
    const id_dossier = req.params.id
    const id_creance = await Dossier.findOne({
      where: {NDossier:id_dossier},
      attributes:["creanceId"]
    }) 
    const creance = await Creance.findOne({
      where: {id: id_creance.creanceId}
    })
    if(!creance) {
      return res.status(404).json({ message: "Créance not found" });
    }
    res.status(200).json(creance)
  }catch(err) {
    res.status(500).send(err.message)
  }
}

module.exports = { saveCreance, sendCreances};
