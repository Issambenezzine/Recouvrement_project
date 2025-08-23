// const { mapper } = require("../services/mapFields.js");
// const { saveDossier } = require("../controller/dossierController.js");
// const {
//   saveDebiteur,
//   saveConjoint,
// } = require("../controller/debiteurController.js");
// const { saveCreance } = require("../controller/creanceController.js");
// const { saveEmployeur } = require("../controller/employeurController.js");
// const {
//   getGestionnairesId,
// } = require("../controller/gestionnaireController.js");
// const { distributeDossiers } = require("../services/distributeTasks.js");
// const { saveCautionneur } = require("../controller/cautionneurController.js");
// const Debiteur_Addresse = require("../models/Debiteur_Address.js");
// const Debiteur_Conjoint = require("../models/Debiteur_Conjoint.js");
// const connection = require("../config/db.js");
// const Creance = require("../models/Creance.js");
// const Dossier = require("../models/Dossier.js");
// const Debiteur = require("../models/Debiteur.js");
// const Debiteur_Cautionneur = require("../models/Debiteur_Cautionneur.js");
// const Debiteur_Employeur = require("../models/Debiteur_Employeur.js");
// const moment = require("moment");
// const { fetchDossiersAgenda } = require("./agendaController.js");
// const Responsable = require("../models/Responsable.js");
// const Client = require("../models/Client.js");
// const Timeline = require("../models/Timeline.js");
// const Admin = require("../models/Admin.js");

// let portefeuille = [];

// let newData = false;
// exports.getNewData = () => newData;
// exports.setNewData = (value) => (newData = value);

// exports.importData = async (req, res) => {
//   try {
//     const { data, repartitionAutomatique, lot, manager, len, client } =req.body;
//     // console.log({ repartitionAutomatique, lot, manager, len, client, data });

//     const mappedFields = await mapper(data);
//     portefeuille = mappedFields;
//     // console.log("portefeuille length : ",mappedFields[0].length)
//     // if(!portefeuille || portefeuille[0].length != 39){
//     //   return res.status(400).json({message : "Fichier Incompatible avec le system"})
//     // }

//     const ids = await getGestionnairesId(manager);
//     const idsGestionnaire = ids.map((id) => id.id);
//     // console.log(idsGestionnaire);

//    const admineIds = await Admin.findAll({
//       where: {},
//       attributes: ["id"],
//     }).then((results) => results.map((g) => ({ id: g.id})));

//     if(ids.length === 0){
//       res.status(400).json({message : "Aucun gestionnaire trouvé "})
//     }

//     if (repartitionAutomatique === true) {
//       distributeDossiers(portefeuille, ids);
//     } else {
//       for (const element of portefeuille) {
//         if(
//           element.ID_Gestionnaire === "" ||
//           element.ID_Gestionnaire === null
//         ) {
//           console.log("Tu dois remplir la Column ID Gestionnaire");
//           res
//             .status(400)
//             .json({ message: "Veuillez compléter la colonne 'ID Gestionnaire'" });
//         }
//         else if(!idsGestionnaire.includes(Number(element.ID_Gestionnaire))) {
//           // console.log(element.ID_Gestionnaire)
//           res
//             .status(400)
//             .json({ message: "ID Gestionnaire n'existe pas !" });
//         }

//       }
//     }

//     if (!(await this.saveDebiteurs(client))) {
//       res
//             .status(400)
//             .json({ message: "Une Erreur est survenu lors de l'enregistrement des débiteurs" });
//     }
//     if (!(await this.saveDossiers(lot, manager, client))) {
//       res
//             .status(400)
//             .json({ message: "Une Erreur est survenu lors de l'enregistrement des dossiers" });
//     }

//     const [results, metadata] = await connection.query(`
//       SELECT username as Gestionnaire, COUNT(*) as dossiers, SUM(creance) as TOTAL
//       FROM (
//       SELECT * FROM prc.dossier ORDER BY id DESC LIMIT ${len}
//       ) AS last_dossiers
//       INNER JOIN prc.gestionnaire ON last_dossiers.gestionnaireId = gestionnaire.id
//       INNER JOIN creance ON creance.id = last_dossiers.creanceId
//       GROUP BY gestionnaireId
//     `);
//     console.log(results);

//     const io = req.app.get("io");
//     for(const id of admineIds) {
//       let updatedDossiersAdmin = await fetchDossiersAgenda(id, "ADMIN");
//       io.emit("dossiersAgendaData", {dossiers:updatedDossiersAdmin,id:id, role:"ADMIN"});
//     }
//     const updatedDossiersRespo = await fetchDossiersAgenda(
//       manager,
//       "RESPONSABLE"
//     );
//     io.emit("dossiersAgendaData", {dossiers:updatedDossiersRespo,id:manager, role:"RESPONSABLE"});

//     for (const gest of ids) {
//       let updatedDossiers = await fetchDossiersAgenda(
//         gest.id,
//         "GESTIONNAIRE"
//       );
//       io.emit("dossiersAgendaData", {dossiers:updatedDossiers,id:gest.id,role:"GESTIONNAIRE"});
//     }
//     this.setNewData(true)
//     res.status(201).send();
//   } catch (err) {
//     console.log("error in importController :", err.message);
//     res.status(500).send(err.message);
//   }
// };

// exports.saveDebiteurs = async (client) => {
//   const t = await connection.transaction();
//   try {
//     const addresses = [];
//     const employeurs = [];
//     const cautionneurs = [];
//     const conjoints = [];

//     for (const element of portefeuille) {
//       console.log(`📌 Processing debiteur CIN: ${element.debiteur_CIN}`);
//       if(element.debiteur_CIN.trim() === "" || element.debiteur_CIN === null) {
//         return false;
//       }
//       const debiteur = await saveDebiteur(
//         element.debiteur_CIN,
//         element.debiteur,
//         element.debiteur_profession,
//         element.debiteur_date_naissance,
//         element.debiteur_tel1,
//         element.debiteur_tel2
//       );

//       if (debiteur === null) {
//         continue;
//       }

//       const debiteurId = debiteur.CIN; // Use id if available

//       // Collect address
//       if (element.debiteur_adresse?.trim()) {
//         addresses.push({
//           addresseDebiteur: element.debiteur_adresse,
//           ville: element.debiteur_ville || "",
//           marche:client,
//           debiteurId,
//         });
//       }

//       // Collect employeur
//       if (element.employeur?.trim()) {
//         employeurs.push({
//           employeur: element.employeur,
//           addresse: element.employeur_adresse,
//           ville: element.employeur_ville,
//           employeur_tel1: element.employeur_tel1,
//           employeur_tel2: element.employeur_tel2,
//           debiteurId,
//         });
//       }

//       // Collect cautionneur
//       if (
//         element.cautionneur?.trim() ||
//         element.cautionneur_CIN?.trim() ||
//         element.cautionneur_adresse?.trim() ||
//         element.cautionneur_ville?.trim() ||
//         element.cautionneur_tel1?.trim() ||
//         element.cautionneur_tel2?.trim()
//       ) {
//         cautionneurs.push({
//           CIN: element.cautionneur_CIN,
//           nom: element.cautionneur,
//           addresse: element.cautionneur_adresse,
//           ville: element.cautionneur_ville,
//           cautionneurTel1: element.cautionneur_tel1,
//           cautionneurTel2: element.cautionneur_tel2,
//           debiteurId,
//         });
//       }

//       // Collect conjoint
//       if (
//         element.conjoint_nom?.trim() ||
//         element.conjoint_CIN?.trim() ||
//         element.conjoint_tel1?.trim() ||
//         element.conjoint_tel2?.trim() ||
//         element.conjoint_adresse?.trim() ||
//         element.conjoint_ville?.trim()
//       ) {
//         conjoints.push({
//           cin: element.conjoint_CIN,
//           ville: element.conjoint_ville,
//           addresse: element.conjoint_adresse,
//           conjoint_tel1: element.conjoint_tel1,
//           conjoint_tel2: element.conjoint_tel2,
//           debiteurId,
//         });
//       }
//     }

//     // ✅ Bulk insert all related data
//     await Promise.all([
//       Debiteur_Addresse.bulkCreate(addresses, {
//         validate: false,
//         hooks: false,
//       }),
//       Debiteur_Employeur.bulkCreate(employeurs, {
//         validate: false,
//         hooks: false,
//       }),
//       Debiteur_Cautionneur.bulkCreate(cautionneurs, {
//         validate: false,
//         hooks: false,
//       }),
//       Debiteur_Conjoint.bulkCreate(conjoints, {
//         validate: false,
//         hooks: false,
//       }),
//     ]);

//     await t.commit();
//     console.log("✅ All debiteurs processed.");
//     console.log("✅ All employeurs processed.");
//     console.log("✅ All cautionneurs processed.");
//     console.log("✅ All conjoints processed.");
//     return true
//   } catch (err) {
//     await t.rollback();
//     console.error("❌ Error in saveDebiteurs:", err);
//     return false
//   }
// };

// exports.saveDossiers = async (lot, responsable, client) => {
//   const t = await connection.transaction(); // Start transaction
//   try {
//     const creances = [];
//     const dossierss = [];

//     for (const element of portefeuille) {
//       const date1EcheanceF = moment(
//         element.date_premiere_echeance,
//         "DD/MM/YYYY"
//       ).toDate();
//       const date2EcheanceF = moment(
//         element.date_derniere_echeance,
//         "DD/MM/YYYY"
//       ).toDate();
//       const dateContentieuxF = moment(
//         element.date_Contentieux,
//         "DD/MM/YYYY"
//       ).toDate();
//       creances.push({
//         capital: element.capital,
//         creance: element.creance,
//         solde: element.creance,
//         intRetard: element.intRetard,
//         autreFrais: element.Autres_frais,
//         date1Echeance: date1EcheanceF,
//         dateDEcheance: date2EcheanceF,
//         dateContentieux: dateContentieuxF,
//         duree: element.duree,
//         mensualite: element.mensualite,
//       });
//     }

//     // Step 2: Bulk insert creances with transaction
//     const createdCreances = await Creance.bulkCreate(creances, {
//       validate: false,
//       hooks: false,
//       returning: true,
//       transaction: t, // pass transaction here
//     });

//     // Step 3: Prepare dossiers with FK to creance
//     portefeuille.forEach((element, index) => {
//       if(element.N_dossier === null || element.N_dossier === undefined) {
//         return false;
//       }
//       dossierss.push({
//         NDossier: element.N_dossier,
//         categorie: element.categorie,
//         type: "contentieux",
//         etat: "Nouvelles actions",
//         etatResponsable: "Nouvelles actions",
//         clientId: 1,
//         status: "INITIE",
//         commentaire: element.commentaire_gestionnaire,
//         commentaire_responsable: element.commentaire_responsable,
//         debiteurId: element.debiteur_CIN,
//         creanceId: createdCreances[index].id,
//         gestionnaireId: element.ID_Gestionnaire,
//         autre: element.autre,
//         date_prevu: new Date(),
//         lotId: Number(lot),
//         encaisse: 0,
//         responsableId: responsable,
//         clientId: client,
//         cadrage: "NON"
//       });
//     });

//     // Step 4: Bulk insert dossiers with transaction
//     await Dossier.bulkCreate(dossierss, {
//       validate: false,
//       hooks: false,
//       transaction: t, // pass transaction here
//     });

//     await t.commit(); // ✅ Commit if all successful
//     console.log("✅ All dossiers and creances saved in a transaction.");
//     return true
//   } catch (err) {
//     await t.rollback(); // ❌ Rollback if error
//     console.error("❌ Transaction failed in saveDossiers:", err.message);
//     return false
//   }
// };
const { mapper } = require("../services/mapFields.js");
const { saveDossier } = require("../controller/dossierController.js");
const {
  saveDebiteur,
  saveConjoint,
} = require("../controller/debiteurController.js");
const { saveCreance } = require("../controller/creanceController.js");
const { saveEmployeur } = require("../controller/employeurController.js");
const {
  getGestionnairesId,
} = require("../controller/gestionnaireController.js");
const { distributeDossiers } = require("../services/distributeTasks.js");
const { saveCautionneur } = require("../controller/cautionneurController.js");
const Debiteur_Addresse = require("../models/Debiteur_Address.js");
const Debiteur_Conjoint = require("../models/Debiteur_Conjoint.js");
const connection = require("../config/db.js");
const Creance = require("../models/Creance.js");
const Dossier = require("../models/Dossier.js");
const Debiteur = require("../models/Debiteur.js");
const Debiteur_Cautionneur = require("../models/Debiteur_Cautionneur.js");
const Debiteur_Employeur = require("../models/Debiteur_Employeur.js");
const moment = require("moment");
const { fetchDossiersAgenda } = require("./agendaController.js");
const Responsable = require("../models/Responsable.js");
const Client = require("../models/Client.js");
const Timeline = require("../models/Timeline.js");
const Admin = require("../models/Admin.js");
const Gestionnaire = require("../models/Gestionnaire.js");


// Add Redis client
const redisClient = require("../config/redis.js");

// Connect to Redis when the module loads

let portefeuille = [];

let newData = false;
exports.getNewData = () => newData;
exports.setNewData = (value) => (newData = value);

exports.importData = async (req, res) => {
  try {
    const { data, repartitionAutomatique, lot, manager, len, client } =
      req.body;

    const mappedFields = await mapper(data);
    portefeuille = mappedFields;

    const ids = await getGestionnairesId(manager);
    const idsGestionnaire = ids.map((id) => id.id);

    const admineIds = await Admin.findAll({
      where: {},
      attributes: ["id"],
    }).then((results) => results.map((g) => ({ id: g.id })));

    if (ids.length === 0) {
      res.status(400).json({ message: "Aucun gestionnaire trouvé " });
    }

    if (repartitionAutomatique === true) {
      distributeDossiers(portefeuille, ids);
    } else {
      for (const element of portefeuille) {
        if (
          element.ID_Gestionnaire === "" ||
          element.ID_Gestionnaire === null
        ) {
          console.log("Tu dois remplir la Column ID Gestionnaire");
          res.status(400).json({
            message: "Veuillez compléter la colonne 'ID Gestionnaire'",
          });
        } else if (!idsGestionnaire.includes(Number(element.ID_Gestionnaire))) {
          res.status(400).json({ message: "ID Gestionnaire n'existe pas !" });
        }
      }
    }

    // Save to database first to get the IDs
    if (!(await this.saveDebiteurs(client))) {
      res.status(400).json({
        message:
          "Une Erreur est survenu lors de l'enregistrement des débiteurs",
      });
      return;
    }

    const savedDossierIds = await this.saveDossiers(lot, manager, client);
    if (!savedDossierIds) {
      res.status(400).json({
        message: "Une Erreur est survenu lors de l'enregistrement des dossiers",
      });
      return;
    }

    // Now store data in Redis with database IDs
    const redisKey = "2002_KAFKA";
    const redisData = await this.prepareRedisDataWithIds(
      client,
      manager,
      ids,
      savedDossierIds
    );

    let existing = await redisClient.get(redisKey);
    if (existing) {
      // Parse existing array
      let arr = JSON.parse(existing);

      // Append new data
      arr["redisStructure"].push(...redisData["redisStructure"]);

      // Save back
      await redisClient.set(redisKey, JSON.stringify(arr));
    } else {
      // Create new array with the first element
      await redisClient.set(redisKey, JSON.stringify(redisData));
    }

    // const redisDataCountDossiers = JSON.parse(await redisClient.get(redisKey));
    // for(const dossier of redisDataCountDossiers.redisStructure) {
    //   let count = redisDataCountDossiers.redisStructure.filter((d) => d.dossier.debiteurId == dossier.dossier.debiteurId).length
    //   Object.assign(
    //     dossier,
    //     {nombre_dossier : count}
    //   )
    // }

    const [results, metadata] = await connection.query(`
      SELECT username as Gestionnaire, COUNT(*) as dossiers, SUM(creance) as TOTAL 
      FROM (
      SELECT * FROM prc.dossier ORDER BY id DESC LIMIT ${len}
      ) AS last_dossiers
      INNER JOIN prc.gestionnaire ON last_dossiers.gestionnaireId = gestionnaire.id 
      INNER JOIN creance ON creance.id = last_dossiers.creanceId  
      GROUP BY gestionnaireId
    `);
    console.log(results);

    const io = req.app.get("io");
    for (const id of admineIds) {
      let updatedDossiersAdmin = await fetchDossiersAgenda(id, "ADMIN");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersAdmin,
        id: id,
        role: "ADMIN",
      });
    }
    const updatedDossiersRespo = await fetchDossiersAgenda(
      manager,
      "RESPONSABLE"
    );
    io.emit("dossiersAgendaData", {
      dossiers: updatedDossiersRespo,
      id: manager,
      role: "RESPONSABLE",
    });

    for (const gest of ids) {
      let updatedDossiers = await fetchDossiersAgenda(gest.id, "GESTIONNAIRE");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiers,
        id: gest.id,
        role: "GESTIONNAIRE",
      });
    }

    this.setNewData(true);
    res.status(201).json({
      message: "Data imported successfully",
      redisKey: redisKey,
    });
    // await redisClient.disconnect();
  } catch (err) {
    console.log("error in importController :", err.message);
    res.status(500).send(err.message);
  }
};

// New method to prepare data for Redis storage WITH database IDs
exports.prepareRedisDataWithIds = async (
  clientId,
  managerId,
  gestionnaires,
  savedDossierIds
) => {
  try {
    // Fetch client data
    const clientData = await Client.findByPk(clientId);

    // Fetch manager data
    const managerData = await Responsable.findByPk(managerId);

    // Get the saved dossiers with all related data
    const savedDossiers = await Dossier.findAll({
      where: {
        id: savedDossierIds,
      },
      include: [
        {
          model: Creance,
          as: "creance",
        },
        {
          model: Debiteur,
          as: "debiteur",
          include: [
            {
              model: Debiteur_Addresse,
              as: "debiteur_addresse",
            },
            {
              model: Debiteur_Employeur,
              as: "debiteur_employeur",
            },
            {
              model: Debiteur_Cautionneur,
              as: "debiteur_ca",
            },
            {
              model: Debiteur_Conjoint,
              as: "debiteur_conjoint",
            },
          ],
        },
        {
          model: Gestionnaire,
          as: "dossier_gestionnaire",
        },
        {
          model: Timeline,
          as: "timeline_dossier",
        },
      ],
    });

    const redisStructure = [];

    for (const savedDossier of savedDossiers) {
      // Prepare dossier data with database ID
      // let nombre_dossier = await Dossier.count({where:{id:saved}})
      const dossier = {
        id: savedDossier.id, // Database ID
        NDossier: savedDossier.NDossier,
        categorie: savedDossier.categorie,
        type: savedDossier.type,
        etat: savedDossier.etat,
        etatResponsable: savedDossier.etatResponsable,
        status: savedDossier.status,
        commentaire: savedDossier.commentaire,
        commentaire_responsable: savedDossier.commentaire_responsable,
        autre: savedDossier.autre,
        date_prevu: savedDossier.date_prevu,
        encaisse: savedDossier.encaisse,
        cadrage: savedDossier.cadrage,
        lotId: savedDossier.lotId,
        responsableId: savedDossier.responsableId,
        gestionnaireId: savedDossier.gestionnaireId,
        clientId: savedDossier.clientId,
        createdAt: savedDossier.createdAt,
        updatedAt: savedDossier.updatedAt,
      };

      // Prepare actions (can be empty initially)
      const actions = [];

      // Prepare debiteur info with database IDs
      const debiteur = {
        id: savedDossier.debiteur?.id, // Database ID
        CIN: savedDossier.debiteur?.CIN,
        nom: savedDossier.debiteur?.nom,
        profession: savedDossier.debiteur?.profession,
        dateNaissance: savedDossier.debiteur?.date_naissance,
        tel1: savedDossier.debiteur?.debiteur_tel1,
        tel2: savedDossier.debiteur?.debiteur_tel2,
        createdAt: savedDossier.debiteur?.createdAt,
        updatedAt: savedDossier.debiteur?.updatedAt,
      };

      // Prepare addresses with database IDs
      const addresses =
        savedDossier.debiteur?.debiteur_addresse?.map((addr) => ({
          id: addr.id, // Database ID
          addresseDebiteur: addr.addresseDebiteur,
          ville: addr.ville,
          marche: addr.marche,
          debiteurId: addr.debiteurId,
          createdAt: addr.createdAt,
          updatedAt: addr.updatedAt,
        })) || [];

      // Prepare debiteur additional info with database IDs
      const debiteurInfo = {
        debiteur,
        addresses,
        employeur:
          savedDossier.debiteur?.debiteur_employeur?.length > 0
            ? {
                id: savedDossier.debiteur.debiteur_employeur[0].id, // Database ID
                employeur:
                  savedDossier.debiteur.debiteur_employeur[0].employeur,
                addresse: savedDossier.debiteur.debiteur_employeur[0].addresse,
                ville: savedDossier.debiteur.debiteur_employeur[0].ville,
                employeur_tel1:
                  savedDossier.debiteur.debiteur_employeur[0].employeur_tel1,
                employeur_tel2:
                  savedDossier.debiteur.debiteur_employeur[0].employeur_tel2,
                debiteurId:
                  savedDossier.debiteur.debiteur_employeur[0].debiteurId,
                createdAt:
                  savedDossier.debiteur.debiteur_employeur[0].createdAt,
                updatedAt:
                  savedDossier.debiteur.debiteur_employeur[0].updatedAt,
              }
            : null,
        cautionneur:
          savedDossier.debiteur?.debiteur_ca?.length > 0
            ? {
                id: savedDossier.debiteur.debiteur_ca[0].id, // Database ID
                CIN: savedDossier.debiteur.debiteur_ca[0].CIN,
                nom: savedDossier.debiteur.debiteur_ca[0].nom,
                addresse: savedDossier.debiteur.debiteur_ca[0].addresse,
                ville: savedDossier.debiteur.debiteur_ca[0].ville,
                cautionneurTel1:
                  savedDossier.debiteur.debiteur_ca[0].cautionneurTel1,
                cautionneurTel2:
                  savedDossier.debiteur.debiteur_ca[0].cautionneurTel2,
                debiteurId: savedDossier.debiteur.debiteur_ca[0].debiteurId,
                createdAt: savedDossier.debiteur.debiteur_ca[0].createdAt,
                updatedAt: savedDossier.debiteur.debiteur_ca[0].updatedAt,
              }
            : null,
        conjoint:
          savedDossier.debiteur?.debiteur_conjoint?.length > 0
            ? {
                id: savedDossier.debiteur.debiteur_conjoint[0].id, // Database ID
                cin: savedDossier.debiteur.debiteur_conjoint[0].cin,
                nom: savedDossier.debiteur.debiteur_conjoint[0].nom,
                ville: savedDossier.debiteur.debiteur_conjoint[0].ville,
                addresse: savedDossier.debiteur.debiteur_conjoint[0].addresse,
                conjoint_tel1:
                  savedDossier.debiteur.debiteur_conjoint[0].conjoint_tel1,
                conjoint_tel2:
                  savedDossier.debiteur.debiteur_conjoint[0].conjoint_tel2,
                debiteurId:
                  savedDossier.debiteur.debiteur_conjoint[0].debiteurId,
                createdAt: savedDossier.debiteur.debiteur_conjoint[0].createdAt,
                updatedAt: savedDossier.debiteur.debiteur_conjoint[0].updatedAt,
              }
            : null,
      };

      // Prepare creance with database ID
      const creance = {
        id: savedDossier.creance?.id, // Database ID
        capital: savedDossier.creance?.capital,
        creance: savedDossier.creance?.creance,
        solde: savedDossier.creance?.creance,
        intRetard: savedDossier.creance?.intRetard,
        autreFrais: savedDossier.creance?.autreFrais,
        date1Echeance: savedDossier.creance?.date1Echeance,
        dateDEcheance: savedDossier.creance?.dateDEcheance,
        dateContentieux: savedDossier.creance?.dateContentieux,
        duree: savedDossier.creance?.duree,
        mensualite: savedDossier.creance?.mensualite,
        createdAt: savedDossier.creance?.createdAt,
        updatedAt: savedDossier.creance?.updatedAt,
      };

      // Prepare timeline with database IDs
      const timeline =
        savedDossier.timeline_dossier?.map((t) => ({
          id: t.id, // Database ID
          action: t.action,
          date: t.date,
          commentaire: t.commentaire,
          dossierId: t.dossierId,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })) || [];

      // Prepare pieces (empty initially but with structure for future IDs)
      const pieces = [];

      // Prepare encaissement (empty initially but with structure for future IDs)
      const encaissement = [];

      // Build the complete structure
      const redisRecord = {
        dossier,
        actions,
        client: {
          id: clientData?.id,
          marche: clientData?.marche,
          visibility: clientData?.visibility,
          commissione: clientData?.commissione,
          // Add other client fields as needed
        },
        gestionnaire: savedDossier.dossier_gestionnaire?.username || null,
        gestionnaireId: savedDossier.dossier_gestionnaire?.id || null,
        manager: managerData?.username || null,
        debiteurInfo,
        nombre_dossier: 1, // This would be calculated based on your needs
        creance,
        timeline,
        pieces,
        encaissement,
      };

      redisStructure.push(redisRecord);
    }

    return {
      redisStructure,
    };
  } catch (err) {
    console.error("Error preparing Redis data with IDs:", err);
    throw err;
  }
};

// Method to retrieve data from Redis
exports.getRedisData = async (redisKey) => {
  try {
    const data = await redisClient.get(redisKey);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Error retrieving Redis data:", err);
    return null;
  }
};

// Method to delete data from Redis
exports.deleteRedisData = async (redisKey) => {
  try {
    await redisClient.del(redisKey);
    console.log(`✅ Redis data deleted for key: ${redisKey}`);
  } catch (err) {
    console.error("Error deleting Redis data:", err);
  }
};

exports.saveDebiteurs = async (client) => {
  const t = await connection.transaction();
  try {
    const addresses = [];
    const employeurs = [];
    const cautionneurs = [];
    const conjoints = [];

    for (const element of portefeuille) {
      console.log(`📌 Processing debiteur CIN: ${element.debiteur_CIN}`);
      if (element.debiteur_CIN.trim() === "" || element.debiteur_CIN === null) {
        return false;
      }
      const debiteur = await saveDebiteur(
        element.debiteur_CIN,
        element.debiteur,
        element.debiteur_profession,
        element.debiteur_date_naissance,
        element.debiteur_tel1,
        element.debiteur_tel2
      );

      if (debiteur === null) {
        continue;
      }

      const debiteurId = debiteur.CIN;

      if (element.debiteur_adresse?.trim()) {
        addresses.push({
          addresseDebiteur: element.debiteur_adresse,
          ville: element.debiteur_ville || "",
          marche: client,
          debiteurId,
        });
      }

      if (element.employeur?.trim()) {
        employeurs.push({
          employeur: element.employeur,
          addresse: element.employeur_adresse,
          ville: element.employeur_ville,
          employeur_tel1: element.employeur_tel1,
          employeur_tel2: element.employeur_tel2,
          debiteurId,
        });
      }

      if (
        element.cautionneur?.trim() ||
        element.cautionneur_CIN?.trim() ||
        element.cautionneur_adresse?.trim() ||
        element.cautionneur_ville?.trim() ||
        element.cautionneur_tel1?.trim() ||
        element.cautionneur_tel2?.trim()
      ) {
        cautionneurs.push({
          CIN: element.cautionneur_CIN,
          nom: element.cautionneur,
          addresse: element.cautionneur_adresse,
          ville: element.cautionneur_ville,
          cautionneurTel1: element.cautionneur_tel1,
          cautionneurTel2: element.cautionneur_tel2,
          debiteurId,
        });
      }

      if (
        element.conjoint_nom?.trim() ||
        element.conjoint_CIN?.trim() ||
        element.conjoint_tel1?.trim() ||
        element.conjoint_tel2?.trim() ||
        element.conjoint_adresse?.trim() ||
        element.conjoint_ville?.trim()
      ) {
        conjoints.push({
          cin: element.conjoint_CIN,
          nom: element.conjoint_nom,
          ville: element.conjoint_ville,
          addresse: element.conjoint_adresse,
          conjoint_tel1: element.conjoint_tel1,
          conjoint_tel2: element.conjoint_tel2,
          debiteurId,
        });
      }
    }

    await Promise.all([
      Debiteur_Addresse.bulkCreate(addresses, {
        validate: false,
        hooks: false,
      }),
      Debiteur_Employeur.bulkCreate(employeurs, {
        validate: false,
        hooks: false,
      }),
      Debiteur_Cautionneur.bulkCreate(cautionneurs, {
        validate: false,
        hooks: false,
      }),
      Debiteur_Conjoint.bulkCreate(conjoints, {
        validate: false,
        hooks: false,
      }),
    ]);

    await t.commit();
    console.log("✅ All debiteurs processed.");
    console.log("✅ All employeurs processed.");
    console.log("✅ All cautionneurs processed.");
    console.log("✅ All conjoints processed.");
    return true;
  } catch (err) {
    await t.rollback();
    console.error("❌ Error in saveDebiteurs:", err);
    return false;
  }
};

exports.saveDossiers = async (lot, responsable, client) => {
  const t = await connection.transaction();
  try {
    const creances = [];
    const dossierss = [];

    for (const element of portefeuille) {
      const date1EcheanceF = moment(
        element.date_premiere_echeance,
        "DD/MM/YYYY"
      ).toDate();
      const date2EcheanceF = moment(
        element.date_derniere_echeance,
        "DD/MM/YYYY"
      ).toDate();
      const dateContentieuxF = moment(
        element.date_Contentieux,
        "DD/MM/YYYY"
      ).toDate();
      creances.push({
        capital: element.capital,
        creance: element.creance,
        solde: element.creance,
        intRetard: element.intRetard,
        autreFrais: element.Autres_frais,
        date1Echeance: date1EcheanceF,
        dateDEcheance: date2EcheanceF,
        dateContentieux: dateContentieuxF,
        duree: element.duree,
        mensualite: element.mensualite,
      });
    }

    const createdCreances = await Creance.bulkCreate(creances, {
      validate: false,
      hooks: false,
      returning: true,
      transaction: t,
    });

    portefeuille.forEach((element, index) => {
      if (element.N_dossier === null || element.N_dossier === undefined) {
        return false;
      }
      dossierss.push({
        NDossier: element.N_dossier,
        categorie: element.categorie,
        type: "contentieux",
        etat: "Nouvelles actions",
        etatResponsable: "Nouvelles actions",
        clientId: 1,
        status: "INITIE",
        commentaire: element.commentaire_gestionnaire,
        commentaire_responsable: element.commentaire_responsable,
        debiteurId: element.debiteur_CIN,
        creanceId: createdCreances[index].id,
        gestionnaireId: element.ID_Gestionnaire,
        autre: element.autre,
        date_prevu: new Date(),
        lotId: Number(lot),
        encaisse: 0,
        responsableId: responsable,
        clientId: client,
        cadrage: "NON",
      });
    });

    const createdDossiers = await Dossier.bulkCreate(dossierss, {
      validate: false,
      hooks: false,
      returning: true,
      transaction: t,
    });

    await t.commit();
    console.log("✅ All dossiers and creances saved in a transaction.");

    // Return the IDs of created dossiers
    return createdDossiers.map((dossier) => dossier.id);
  } catch (err) {
    await t.rollback();
    console.error("❌ Transaction failed in saveDossiers:", err.message);
    return false;
  }
};
