const Demande_Cadrage = require("../models/Demande_Cadrage.js");

const sendCadrages = async (req, res) => {
  try {
    const cadrage = await Demande_Cadrage.findAll({
      where: { dossierId: req.params.id },
    });
    if(!cadrage) {
        res.status(404).send("Les demandes de cadrage non trouvées !")
    }
    res.status(200).json(cadrage)
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { sendCadrages };
