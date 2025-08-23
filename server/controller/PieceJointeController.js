const Piece_jointe = require("../models/Piece_jointe.js");

const addPieceJointe = async(req,res) => {
    const role = req.body
    if(role === "VISITEUR") {
        return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
    }
    try {
        const {description, responsable, action, nomPiece, src_image, dossierId} = req.body
        const pieceJointe = await Piece_jointe.create({description, responsable, action, nomPiece, src_image, dossierId})
        return res.status(200).json({ message: "Piece jointe ajoutée avec succès" })
    }catch(err) {
        return res.status(500).json({ message: "Une erreur est survenue" });
    }
}


const getPieceJointe = async(req,res) => {
    const { dossierId } = req.params;
    try {
        const pieceJointes = await Piece_jointe.findAll({where:{dossierId}})
        return res.status(200).send(pieceJointes)
    }catch(err) {
        return res.status(500).json({ message: "Une erreur est survenue lors de la récupération des pièces jointes" });
    }
}

module.exports = {
    addPieceJointe,
    getPieceJointe
}