const Historique = require("../models/Historique");


const getHistorique = async (req, res) => {
  try {
    const  id  = req.params.id;
    const historique = await Historique.findAll({
      where: { debiteur_ID: id },
    });
    res.status(200).json(historique);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    getHistorique
}