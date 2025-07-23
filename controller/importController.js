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
const Creance = require("../models/Creance.js")
const Dossier = require("../models/Dossier.js")
const Debiteur = require("../models/Debiteur.js")
const Debiteur_Cautionneur = require("../models/Debiteur_Cautionneur.js")
const Debiteur_Employeur = require("../models/Debiteur_Employeur.js")
const moment = require("moment");
const { fetchDossiersAgenda } = require("./agendaController.js");
const Responsable = require("../models/Responsable.js");


let portefeuille = [];

exports.importData = async (req, res) => {
  try {
    const t = await connection.transaction()
    const { data, repartitionAutomatique,lot,manager } = req.body;
    console.log({repartitionAutomatique,lot,manager })
    const mappedFields = await mapper(data);
    portefeuille = mappedFields;
    if (repartitionAutomatique === 1) {
      distributeDossiers(portefeuille, await getGestionnairesId());
    } else {
      for (const element of portefeuille) {
        if (
          element.ID_Gestionnaire === "" ||
          element.ID_Gestionnaire === null
        ) {
          console.log("Tu dois remplir la Column ID Gestionnaire");
          res.status(400).send("Tu dois remplir la Column ID Gestionnaire");
        }
      }
    }

    const responsable = await Responsable.findOne({where:{username:manager},attributes:["id"]})

    await this.saveDebiteurs();
    await this.saveDossiers(lot,responsable);
    const [results, metadata] = await connection.query(`
      SELECT username as Gestionnaire, COUNT(*) as dossiers, SUM(creance) as TOTAL 
      From prc.dossier 
      INNER JOIN prc.gestionnaire ON dossier.gestionnaireId = gestionnaire.id 
      INNER JOIN creance ON creance.id = dossier.creanceId  
      GROUP BY gestionnaireId
    `);
    console.log(results);
    await t.commit()
    const io = req.app.get("io");
    const updatedDossiers = await fetchDossiersAgenda();
    io.emit("dossiersAgendaData", updatedDossiers)
    res.status(201).send(results);
  } catch (err) {
    await t.rollback()
    res.status(500).send(err.message);
  }
}

exports.saveDebiteurs = async () => {
  const t = await connection.transaction()
  try {
    const addresses = [];
    const employeurs = [];
    const cautionneurs = [];
    const conjoints = [];

    for (const element of portefeuille) {
      console.log(`📌 Processing debiteur CIN: ${element.debiteur_CIN}`);

      // Keep saveDebiteur as is
      const debiteur = await saveDebiteur(
        element.debiteur_CIN,
        element.debiteur,
        element.debiteur_profession,
        element.debiteur_date_naissance,
        element.debiteur_tel1,
        element.debiteur_tel2
      );

      if(debiteur === null) {
        continue;
      }

      const debiteurId = debiteur.CIN; // Use id if available

      // Collect address
      if (element.debiteur_adresse?.trim()) {
        addresses.push({
          addresseDebiteur: element.debiteur_adresse,
          debiteurId,
        });
      }

      // Collect employeur
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

      // Collect cautionneur
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

      // Collect conjoint
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
          ville: element.conjoint_ville,
          addresse: element.conjoint_adresse,
          conjoint_tel1: element.conjoint_tel1,
          conjoint_tel2: element.conjoint_tel2,
          debiteurId,
        });
      }
    }

    // ✅ Bulk insert all related data
    await Promise.all([
      Debiteur_Addresse.bulkCreate(addresses, { validate: false, hooks: false }),
      Debiteur_Employeur.bulkCreate(employeurs, { validate: false, hooks: false }),
      Debiteur_Cautionneur.bulkCreate(cautionneurs, { validate: false, hooks: false }),
      Debiteur_Conjoint.bulkCreate(conjoints, { validate: false, hooks: false }),
    ]);

    await t.commit();
    console.log("✅ All debiteurs processed.");
    console.log("✅ All employeurs processed.");
    console.log("✅ All cautionneurs processed.");
    console.log("✅ All conjoints processed.");
  } catch (err) {
    await t.rollback();
    console.error("❌ Error in saveDebiteurs:", err);
  }
};

exports.saveDossiers = async (lot,responsable) => {
  const t = await connection.transaction(); // Start transaction
  try {
    const creances = [];
    const dossiers = [];

    for (const element of portefeuille) {
      const date1EcheanceF = moment(element.date_premiere_echeance, "DD/MM/YYYY").toDate();
      const date2EcheanceF = moment(element.date_derniere_echeance, "DD/MM/YYYY").toDate();
      const dateContentieuxF = moment(element.date_Contentieux, "DD/MM/YYYY").toDate();
      creances.push({
        capital: element.capital,
        creance: element.creance,
        intRetard: element.intRetard,
        autreFrais: element.Autres_frais,
        date1Echeance: date1EcheanceF,
        dateDEcheance: date2EcheanceF,
        dateContentieux: dateContentieuxF,
        duree: element.duree,
        mensualite: element.mensualite,
      });
    }

    // Step 2: Bulk insert creances with transaction
    const createdCreances = await Creance.bulkCreate(creances, {
      validate: false,
      hooks: false,
      returning: true,
      transaction: t, // pass transaction here
    });

    // Step 3: Prepare dossiers with FK to creance
    portefeuille.forEach((element, index) => {
      dossiers.push({
        NDossier: element.N_dossier,
        categorie: element.categorie,
        type: "contentieux",
        etat : "Nouvelles ations",
        clientId: 1,
        statusId: 1,
        commentaire: element.commentaire_gestionnaire,
        commentaire_responsable: element.commentaire_responsable,
        debiteurId: element.debiteur_CIN,
        creanceId: createdCreances[index].id,
        gestionnaireId: element.ID_Gestionnaire,
        autre: element.autre,
        lotId: Number(lot),
        responsableId: responsable.id
      });
    });

    // Step 4: Bulk insert dossiers with transaction
    await Dossier.bulkCreate(dossiers, {
      validate: false,
      hooks: false,
      transaction: t, // pass transaction here
    });

    await t.commit(); // ✅ Commit if all successful
    console.log("✅ All dossiers and creances saved in a transaction.");
  } catch (err) {
    await t.rollback(); // ❌ Rollback if error
    console.error("❌ Transaction failed in saveDossiers:", err.message);
  }
};

// exports.sendDistribution = async (req, res) => {
//   try {
//     const [results, metadata] = await connection.query(`
//       SELECT username as Gestionnaire, COUNT(*) as dossiers, SUM(creance) as TOTAL 
//       From prc.dossier 
//       INNER JOIN prc.gestionnaire ON dossier.gestionnaireId = gestionnaire.id 
//       INNER JOIN creance ON creance.id = dossier.creanceId  
//       GROUP BY gestionnaireId
//     `);

//     if (!results) {
//       res.status(204).send("Database is Empty");
//     }
//     res.status(200).send(results);
//   } catch (err) {
//     res.status(500).send(`Error Sending Distribution : ${err.message}`);
//   }
// };
