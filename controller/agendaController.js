const Dossier = require("../models/Dossier.js");
const Debiteur = require("../models/Debiteur.js");
const Gestionnaire = require("../models/Gestionnaire.js");
const Responsable = require("../models/Responsable.js");
const Client = require("../models/Client.js");
const Creance = require("../models/Creance.js");
const Timeline = require("../models/Timeline.js");
const Encaissement = require("../models/Encaissement.js");
const Piece_jointe = require("../models/Piece_jointe.js");
const Debiteur_Conjoint = require("../models/Debiteur_Conjoint.js");
const Debiteur_Cautionneur = require("../models/Debiteur_Cautionneur.js");
const Debiteur_Patrimoine = require("../models/Debiteur_Patrimoine.js");
const Debiteur_Addresse = require("../models/Debiteur_Address.js");
const Debiteur_Employeur = require("../models/Debiteur_Employeur.js");
const Debiteur_Retraite = require("../models/Debiteur_Retraite.js");

exports.fetchDossiersAgenda = async () => {
  try {
    const dossiers = await Dossier.findAll();
    if (!dossiers) {
      return "There is no dossiers !";
    }
    const result = [];
    for (const dossier of dossiers) {
      let client = await Client.findOne({
        where: { id: dossier.clientId },
      });
      let gestionnaire = await Gestionnaire.findOne({
        where: { id: dossier.gestionnaireId },
        attributes: ["username", "id"],
      });
      let creance = await Creance.findOne({
        where: { id: dossier.creanceId },
      });
      let CIN_debiteur = dossier.debiteurId;
      let debiteur = await Debiteur.findOne({
        where: { CIN: CIN_debiteur },
      });
      let { count, rows } = await Dossier.findAndCountAll({
        where: { debiteurId: CIN_debiteur },
      });
      let timeline = await Timeline.findAll({
        where: { id: dossier.id },
      });
      let encaissement = await Encaissement.findAll({
        where: { dossierId: dossier.id },
      });
      let pieces = await Piece_jointe.findAll({
        where: { dossierId: dossier.id },
      });
      let conjoint = await Debiteur_Conjoint.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let cautionneur = await Debiteur_Cautionneur.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let patrimoins = await Debiteur_Patrimoine.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let addresses = await Debiteur_Addresse.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let employeurs = await Debiteur_Employeur.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let retraite = await Debiteur_Retraite.findOne({
        where: { debiteurid: CIN_debiteur },
      });
      result.push({
        dossier,
        client,
        gestionnaire: gestionnaire.username,
        gestionnaireId: gestionnaire.id,
        debiteurInfo: {
          debiteur,
          conjoint,
          cautionneur,
          patrimoins,
          addresses,
          employeurs,
        },
        nombre_dossier: count,
        creance,
        timeline,
        encaissement,
        pieces,
        retraite,
      });
    }
    return result;
  } catch (err) {
    return `Error fetching dossiers : ${err.message}`;
  }
};

exports.getDossiersAgenda = async (req, res) => {
  const id = req.user.id
  const role = req.role
  let dossiers
  try {
    if (role === "GESTIONNAIRE") {
      dossiers = await Dossier.findAll({ where: { gestionnaireId: id } });
    } else if (role === "RESPONSABLE") {
      dossiers = await Dossier.findAll({ where: { responsableId: id } });
    } else {
      dossiers = await Dossier.findAll();
    }
    if (!dossiers) {
      res.status(400).send("There is no dossiers !");
    }
    const result = [];
    for (const dossier of dossiers) {
      let client = await Client.findOne({
        where: { id: dossier.clientId },
      });
      let gestionnaire = await Gestionnaire.findOne({
        where: { id: dossier.gestionnaireId },
        attributes: ["username", "id"],
      });
      let creance = await Creance.findOne({
        where: { id: dossier.creanceId },
      });
      let CIN_debiteur = dossier.debiteurId;
      let debiteur = await Debiteur.findOne({
        where: { CIN: CIN_debiteur },
      });
      let { count, rows } = await Dossier.findAndCountAll({
        where: { debiteurId: CIN_debiteur },
      });
      let timeline = await Timeline.findAll({
        where: { id: dossier.id },
      });
      let encaissement = await Encaissement.findAll({
        where: { dossierId: dossier.id },
      });
      let pieces = await Piece_jointe.findAll({
        where: { dossierId: dossier.id },
      });
      let conjoint = await Debiteur_Conjoint.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let cautionneur = await Debiteur_Cautionneur.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let patrimoins = await Debiteur_Patrimoine.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let addresses = await Debiteur_Addresse.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let employeurs = await Debiteur_Employeur.findAll({
        where: { debiteurId: CIN_debiteur },
      });
      let retraite = await Debiteur_Retraite.findOne({
        where: { debiteurid: CIN_debiteur },
      });
      result.push({
        dossier,
        client,
        gestionnaire: gestionnaire.username,
        gestionnaireId: gestionnaire.id,
        debiteurInfo: {
          debiteur,
          conjoint,
          cautionneur,
          patrimoins,
          addresses,
          employeurs,
        },
        nombre_dossier: count,
        creance,
        timeline,
        encaissement,
        pieces,
        retraite,
      });
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(`Error fetching dossiers : ${err.message}`);
  }
};