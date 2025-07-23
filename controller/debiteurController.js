const Debiteur = require("../models/Debiteur.js");
const Dossier = require("../models/Dossier.js");
const Responsable = require("../models/Responsable.js");
const Encaissement = require("../models/Encaissement.js");
const Creance = require("../models/Creance.js");
const moment = require("moment");
const Client = require("../models/Client.js");
const Gestionnaire = require("../models/Gestionnaire.js");
const Debiteur_Addresse = require("../models/Debiteur_Address.js");
const Debiteur_Conjoint = require("../models/Debiteur_Conjoint.js");

const saveDebiteur = async (
  CIN,
  nom,
  profession,
  date_naissance,
  debiteur_tel1,
  debiteur_tel2
) => {
  try {
    CIN = CIN.trim();

    const existingDebiteur = await Debiteur.findByPk(CIN);

    if (existingDebiteur) {
      console.log(`Debiteur with CIN ${CIN} already exists.`);
      return null;
    }

    const date_naissanceF = moment(date_naissance, "DD/MM/YYYY").toDate();
    const debiteur = await Debiteur.create({
      CIN,
      nom,
      profession,
      date_naissance: date_naissanceF,
      debiteur_tel1,
      debiteur_tel2,
    });
    console.log("Debiteur created:", debiteur.CIN);
    return debiteur;
  } catch (err) {
    console.error("Error saving debiteur:", err.message);
    throw err;
  }
};

const debiteurInfo = async (req, res) => {
  try {
    const debiteur_CIN = req.params.cin;

    const dossiersRaw = await Dossier.findAll({
      where: { debiteurId: debiteur_CIN },
    });

    const debiteur = await Debiteur.findByPk(debiteur_CIN);

    let dossiers = [];

    for (const element of dossiersRaw) {
      const client = await Client.findOne({
        where: { id: element.clientId },
      });

      const creance = await Creance.findOne({
        where: { id: element.creanceId },
      });

      const encaissement = await Encaissement.findAll({
        where: { dossierId: element.NDossier },
        attributes: ["montant"],
      });

      const dossierEntity = {
        debiteur: debiteur?.nom,
        CIN: debiteur_CIN,
        NDossier: element.NDossier,
        gestionnaire: "",
        responsable: "",
        marche: client?.marche,
        creance: creance?.creance,
        intRetard: creance?.intRetard,
        capital: creance?.capital,
        autreFrais: creance?.autreFrais,
        encaissement: encaissement,
      };

      dossiers.push(dossierEntity);
    }

    res.status(200).json(dossiers);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const saveDebiteurAddresse = async (req, res) => {
  try {
    const { addresseS } = req.body;
    const addresse = await Debiteur_Addresse.create({ addresseS });
    res.status(201).send(addresse);
  } catch (err) {
    console.log(`Error saving Debiteur Addresse : ${err.message}`);
    res.status(500).send("Error saving addresse");
  }
};

const saveConjoint = async (
  cin,
  ville,
  addresse,
  conjoint_tel1,
  conjoint_tel2,
  debiteurId
) => {
  try {
    await Debiteur_Conjoint.bulkCreate({
      cin,
      ville,
      addresse,
      conjoint_tel1,
      conjoint_tel2,
      debiteurId
    }, { validate: true });
  } catch (err) {
    console.log(`Error saving conjoint : ${err.message}`);
  }
};

module.exports = {
  saveDebiteur,
  debiteurInfo,
  saveDebiteurAddresse,
  saveConjoint,
};
