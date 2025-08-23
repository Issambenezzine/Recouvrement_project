const Dossier = require("../models/Dossier");

const addGestionnaireCommentaire = async (req, res) => {
  const role = req.role;
  console.log("role : ",role)
  if (role !== "GESTIONNAIRE") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { id, commentaire } = req.body;
  try {
    await Dossier.update(
      { commentaire },
      {
        where: {
          id,
        },
      }
    );
    return res.status(200).json({message:"Commentaire a été ajouté avec succès"});
  } catch (err) {
    console.log(err.message)
    return res.status(500).send(`Error Gestionnaire comment : ${err.message}`);
  }
};

const addResponsableCommentaire = async (req, res) => {
  const role = req.role;
  if (role !== "RESPONSABLE" && role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { id, commentaire } = req.body;
  try {
    await Dossier.update(
      { commentaire_responsable: commentaire },
      {
        where: {
          id,
        },
      }
    );
    return res.status(200).json({message:"Commentaire a été ajouté avec succès"})
  } catch (err) {
    console.log(err.message)
    return res.status(500).send(`Error Gestionnaire comment : ${err.message}`);
  }
};

const fetchComments = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Dossier.findOne({
      where: {
        id,
      },
      attributes: ["commentaire", "commentaire_responsable"],
    });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).send(`Error fetching comments : ${err.message}`);
  }
};

module.exports = { addGestionnaireCommentaire, addResponsableCommentaire, fetchComments};
