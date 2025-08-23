const Encaissement = require("../models/Encaissement.js")
const Piece_jointe = require("../models/Piece_jointe.js")

const getEncaissement = async(req,res) => {
    try {
        const dossierId = req.params.dossierId
        const encaissement = await Encaissement.findAll({
            where: { dossierId: dossierId }
        });
        res.status(200).json(encaissement);
    }catch {
        res.status(500).json({ error: error.message });
    }
}


const addEncaissement = async (req, res) => {
  const role = req.role  
  if(role === "VISITEUR"){
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const { modeReg, typeReg, montant, dateReg, responsable, dossierId } = req.body;
    const encaissement = await Encaissement.create({
      modeReg,
      typeReg,
      montant,
      dateReg,
      responsable,
      dossierId
    });
    res.status(201).json(encaissement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadPieceJointe = async (req, res) => {
    const role = req.role  
  if(role === "VISITEUR"){
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    
    const { encaissementId, description,responsable,action,nomPiece,src_image,dossierId } = req.body;
    const pieceJointe = await Piece_jointe.create({
      encaissementId,
      description,responsable,action,nomPiece,src_image,dossierId 
    });
    res.status(201).json(pieceJointe);
  }catch(err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  addEncaissement,
  uploadPieceJointe,
  getEncaissement
}