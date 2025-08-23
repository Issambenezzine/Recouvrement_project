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

let portefeuille = [];

exports.importData = async (req, res) => {
  try {
    const { data, repartitionAutomatique } = req.body;
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
    await this.saveDebiteurs();
    await this.saveDossiers();
    const [results, metadata] = await connection.query(`
      SELECT username as Gestionnaire, COUNT(*) as dossiers, SUM(creance) as TOTAL 
      From prc.dossier 
      INNER JOIN prc.gestionnaire ON dossier.gestionnaireId = gestionnaire.id 
      INNER JOIN creance ON creance.id = dossier.creanceId  
      GROUP BY gestionnaireId
    `);
    console.log(results)
    res.status(201).send(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.saveDebiteurs = async () => {
  try {
    for (const element of portefeuille) {
      console.log(`📌 Processing debiteur CIN: ${element.debiteur_CIN}`);

      const debiteur = await saveDebiteur(
        element.debiteur_CIN,
        element.debiteur,
        element.debiteur_profession,
        element.debiteur_date_naissance,
        element.debiteur_tel1,
        element.debiteur_tel2
      );
      const debiteurId = debiteur.CIN;
      if (element.debiteur_adresse != "" || element.debiteur_adresse != null) {
        const addresseDebiteur = element.debiteur_adresse;
        await Debiteur_Addresse.create({ addresseDebiteur, debiteurId });
      }

      if (element.employeur && element.employeur.trim() !== "") {
        // console.log(element.employeur);
        await saveEmployeur(
          element.employeur,
          element.employeur_adresse,
          element.employeur_ville,
          element.employeur_tel1,
          element.employeur_tel2,
          debiteurId
        );
      }
      if (
        element.cautionneur !== "" ||
        element.cautionneur_CIN !== "" ||
        element.cautionneur_adresse !== "" ||
        element.cautionneur_ville !== "" ||
        element.employeur_tel2 !== "" ||
        element.employeur_tel2 !== ""
      ) {
        await saveCautionneur(
          element.cautionneur_CIN,
          element.cautionneur,
          element.cautionneur_adresse,
          element.cautionneur_ville,
          element.cautionneur_tel1,
          element.cautionneur_tel2,
          debiteurId
        );
      }

      if (
        element.conjoint_nom !== "" ||
        element.conjoint_CIN !== "" ||
        element.conjoint_tel1 !== "" ||
        element.conjoint_tel2 !== "" ||
        element.conjoint_adresse !== "" ||
        element.conjoint_ville !== ""
      ) {
        await saveConjoint(
          element.conjoint_CIN,
          element.conjoint_ville,
          element.conjoint_adresse,
          element.conjoint_tel1,
          element.conjoint_tel2,
          debiteurId
        );
      }
    }
    console.log("✅ All debiteurs processed.");
    console.log("✅ All employeurs processed.");
    console.log("✅ All cautionneurs processed.");
    console.log("✅ All conjoints processed.");
  } catch (err) {
    console.error("❌ Error in saveDebiteurs:", err);
  }
};

exports.saveDossiers = async () => {
  try {
    for (const element of portefeuille) {
      const creance = await saveCreance(
        element.capital,
        element.creance,
        element.intRetard,
        element.Autres_frais,
        element.date_premiere_echeance,
        element.date_derniere_echeance,
        element.date_Contentieux,
        element.duree,
        element.mensualite
      );

      if (!creance) {
        console.log("Creance not saved for element:", element);
        continue;
      }

      await saveDossier(
        element.N_dossier,
        element.categorie,
        "contentieux",
        1, // clientId
        1, // statusId
        "Nouvelles ations",
        element.debiteur_CIN,
        creance.id,
        element.ID_Gestionnaire
      );
    }

    console.log("✅ All dossiers saved.");
  } catch (err) {
    console.log("❌ Error saving dossiers:", err.message);
  }
};

exports.sendDistribution = async(req,res) => {
  try {
    const [results, metadata] = await connection.query(`
      SELECT username as Gestionnaire, COUNT(*) as dossiers, SUM(creance) as TOTAL 
      From prc.dossier 
      INNER JOIN prc.gestionnaire ON dossier.gestionnaireId = gestionnaire.id 
      INNER JOIN creance ON creance.id = dossier.creanceId  
      GROUP BY gestionnaireId
    `);

    if(!results) {
      res.status(204).send("Database is Empty")
    }
    res.status(200).send(results)
  }catch(err) {
    res.status(500).send(`Error Sending Distribution : ${err.message}`)
  }
}
