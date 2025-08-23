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
const Action = require("../models/Action.js");
const redisClient = require("../config/redis.js");

exports.fetchDossiersAgenda = async (id, role) => {
  try {
    let whereClause = {};
    // if (role === "GESTIONNAIRE") whereClause.gestionnaireId = id;
    // else if (role === "RESPONSABLE") whereClause.responsableId = id;

    const dossiersx = await Dossier.findAll();

    if (!dossiersx || dossiersx.length === 0) {
      return JSON.stringify([]); // Return empty instead of string error
    }
    const redisKey = "2002_KAFKA"; // e.g. "2002_KAFKA"

    // 1. Check if data exists in Redis
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData); // now parsedData.redisStructure exists
      for (const dossier of parsedData.redisStructure) {
        let count = parsedData["redisStructure"].filter(
          (d) => d.debiteurInfo.debiteur.CIN === dossier.debiteurInfo.debiteur.CIN
        ).length;
        dossier.nombre_dossier = count;
      }
      if (role === "GESTIONNAIRE")
        return JSON.stringify(
          parsedData.redisStructure.filter(
            (dossier) => dossier.dossier.gestionnaireId == id
          )
        );
      else if (role === "RESPONSABLE")
        return JSON.stringify(
          parsedData.redisStructure.filter(
            (dossier) => dossier.dossier.responsableId == id
          )
        );
      else return JSON.stringify(parsedData.redisStructure);
    }

    const result = await Promise.all(
      dossiersx.map(async (dossier) => {
        const [
          client,
          gestionnaire,
          manager,
          creance,
          debiteur,
          dossierCountData,
          timeline,
          pieces,
          actions,
          addresses,
          encaissement,
        ] = await Promise.all([
          Client.findOne({ where: { id: dossier.clientId }, raw: true }),
          Gestionnaire.findOne({
            where: { id: dossier.gestionnaireId },
            attributes: ["username", "id"],
            raw: true,
          }),
          Responsable.findOne({
            where: { id: dossier.responsableId },
            raw: true,
            attributes: ["username", "id"],
          }),
          Creance.findOne({ where: { id: dossier.creanceId }, raw: true }),
          Debiteur.findOne({ where: { CIN: dossier.debiteurId }, raw: true }),
          Dossier.count({ where: { debiteurId: dossier.debiteurId } }),
          // Timeline.findAll({ where: { id: dossier.id }, raw: true }),
          Timeline.findAll({ where: { dossierId: dossier.id }, raw: true }),
          Piece_jointe.findAll({ where: { dossierId: dossier.id }, raw: true }),
          Action.findAll({ where: { dossierId: dossier.id }, raw: true }),
          Debiteur_Addresse.findAll({
            where: { debiteurId: dossier.debiteurId },
            raw: true,
          }),
          Encaissement.findAll({ where: { dossierId: dossier.id }, raw: true }),
        ]);

        return {
          dossier,
          actions,
          client,
          gestionnaire: gestionnaire?.username || null,
          gestionnaireId: gestionnaire?.id || null,
          manager: manager?.username || null,
          debiteurInfo: {
            debiteur,
            addresses,
          },
          nombre_dossier: dossierCountData,
          creance,
          timeline,
          pieces,
          encaissement,
        };
      })
    );
    await redisClient.set(redisKey, JSON.stringify({ redisStructure: result }));
    // await redisClient.disconnect();
    if (role == "RESPONSABLE")
      return JSON.stringify(
        result.filter((dossier) => dossier.dossier.responsableId == id)
      );
    else if (role == "GESTIONNAIRE")
      return JSON.stringify(
        result.filter((dossier) => dossier.dossier.gestionnaireId == id)
      );
    else return JSON.stringify(result);
  } catch (err) {
    return `Error fetching dossiers: ${err.message}`;
  }
};

// exports.fetchDossiersAgenda = async (id, role) => {
//   try {
//     let dossiers;
//     if (role === "GESTIONNAIRE") {
//       dossiers = await Dossier.findAll({ where: { gestionnaireId: id }, raw: true  });
//     } else if (role === "RESPONSABLE") {
//       dossiers = await Dossier.findAll({ where: { responsableId: id }, raw: true  });
//     } else {
//       dossiers = await Dossier.findAll({raw: true });
//     }
//     if (!dossiers) {
//       return "There is no dossiers !";
//     }
//     const result = [];
//     for (const dossier of dossiers) {
//       let client = await Client.findOne({ where: { id: dossier.clientId }, raw: true });
//       let gestionnaire = await Gestionnaire.findAll({
//         where: { id: dossier.gestionnaireId },
//         attributes: ["username", "id"],
//         raw: true,
//       });
//       let creance = await Creance.findOne({ where: { id: dossier.creanceId }, raw: true });
//       let CIN_debiteur = dossier.debiteurId;
//       let debiteur = await Debiteur.findOne({ where: { CIN: CIN_debiteur }, raw: true });
//       let { count, rows } = await Dossier.findAndCountAll({ where: { debiteurId: CIN_debiteur }, raw: true });
//       let timeline = await Timeline.findAll({ where: { id: dossier.id }, raw: true });
//       let encaissement = await Encaissement.findAll({ where: { dossierId: dossier.id }, raw: true });
//       let pieces = await Piece_jointe.findAll({ where: { dossierId: dossier.id }, raw: true });
//       let conjoint = await Debiteur_Conjoint.findAll({ where: { debiteurId: CIN_debiteur }, raw: true });
//       let cautionneur = await Debiteur_Cautionneur.findAll({ where: { debiteurId: CIN_debiteur }, raw: true });
//       let patrimoins = await Debiteur_Patrimoine.findAll({ where: { debiteurId: CIN_debiteur }, raw: true });
//       let addresses = await Debiteur_Addresse.findAll({ where: { debiteurId: CIN_debiteur }, raw: true });
//       let employeurs = await Debiteur_Employeur.findOne({ where: { debiteurId: CIN_debiteur }, raw: true });
//       let retraite = await Debiteur_Retraite.findOne({ where: { debiteurid: CIN_debiteur }, raw: true });
//       result.push({
//         dossier,
//         client,
//         gestionnaire: Array.isArray(gestionnaire) && gestionnaire.length > 0 ? gestionnaire[0].username : null,
//         gestionnaireId: Array.isArray(gestionnaire) && gestionnaire.length > 0 ? gestionnaire[0].id : null,
//         debiteurInfo: {
//           debiteur,
//           conjoint: Array.isArray(conjoint) ? conjoint : [],
//           cautionneur: Array.isArray(cautionneur) ? cautionneur : [],
//           patrimoins: Array.isArray(patrimoins) ? patrimoins : [],
//           addresses: Array.isArray(addresses) ? addresses : [],
//           employeurs: Array.isArray(employeurs) ? employeurs : [],
//         },
//         nombre_dossier: count,
//         creance,
//         timeline: Array.isArray(timeline) ? timeline : [],
//         encaissement: Array.isArray(encaissement) ? encaissement : [],
//         pieces: Array.isArray(pieces) ? pieces : [],
//         retraite: Array.isArray(retraite) ? retraite : [],
//       });
//     }
//     return JSON.stringify(result);
//   } catch (err) {
//     return `Error fetching dossiers : ${err.message}`;
//   }
// };

exports.getDossiersAgenda = async (req, res) => {
  const id = req.user.id;
  const role = req.role;
  let dossiers;
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
