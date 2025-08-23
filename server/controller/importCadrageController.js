const Debiteur = require("../models/Debiteur.js");
const Debiteur_Addresse = require("../models/Debiteur_Address.js");
const Debiteur_Banque = require("../models/Debiteur_Banque.js");
const Debiteur_Patrimoine = require("../models/Debiteur_Patrimoine.js");
const {
  mapCadrageAddresse,
  mapCadrageTel,
  mapCadrageBanque,
  mapCadragePatrimoins,
  mapCadrageEmployeur,
} = require("../services/mapFields.js");
const connection = require("../config/db.js");
const Debiteur_Employeur_Cadrage = require("../models/Debiteur_Employeur_Cadrage.js");
const moment = require("moment");
const Dossier = require("../models/Dossier.js");
const { fetchDossiersAgenda } = require("./agendaController.js");
const Historique = require("../models/Historique.js");

const redisClient = require("../config/redis.js");
const redisKey = "2002_KAFKA";

let idGest = new Set();
const dict = new Map();
const notifCount = new Map();
var notifications = [];
const importCadrage = async (req, res) => {
  try {
    const { data, type, marche } = req.body;
    if (data == null) {
      return res.status(401).send("Data is empty !");
    }
    console.log({ data, type, marche });
    let mappedData = [];
    if (type === "Cadrage Addresse") {
      mappedData = mapCadrageAddresse(data);
      await cadrageAddresse(mappedData, marche);
    } else if (type === "Cadrage Téléphonique") {
      mappedData = mapCadrageTel(data);
      await cadrageTele(mappedData, marche);
    } else if (type === "Cadrage Banque") {
      mappedData = mapCadrageBanque(data);
      await cadrageBanque(mappedData, marche);
      // console.log("Mapped data ",mappedData)
    } else if (type === "Cadrage Patrimoins") {
      mappedData = mapCadragePatrimoins(data);
      await cadragePatrimoins(mappedData, marche);
    } else if (type === "Cadrage Employeur") {
      mappedData = mapCadrageEmployeur(data);
      await cadrageEmployeur(mappedData, marche);
    }
    const io = req.app.get("io");
    console.log("notifications : ", notifications);
    console.log("idGest : ", idGest);
    for (const id of idGest) {
      if (!dict.has(id)) {
        dict.set(id, []);
      }
      const userNotifications = notifications.filter(
        (notif) => notif.id === id
      );
      dict.get(id).push(...userNotifications);
      console.log("id : ", id);
      io.emit("Notification", { userId: id, notifs: dict.get(id) });
      let dossiers = await fetchDossiersAgenda(id, "GESTIONNAIRE");
      io.emit("dossiersAgendaData", {
        dossiers: dossiers,
        id: id,
        role: "GESTIONNAIRE",
      });
    }

    const allTitles = [
      "Cadrage Banque",
      "Cadrage Patrimoine",
      "Cadrage Téléphonique",
      "Cadrage CNSS",
      "Cadrage Adresse",
    ];

    // for (const [userId, notifs] of dict.entries()) {
    //   // Initialize empty object for userId
    //   notifCount.set(userId, {});

    //   // Group notifications by dossierId first
    //   const byDossier = {};

    //   for (const notif of notifs) {
    //     const dId = notif.dossierId;
    //     const title = notif.title;

    //     if (!byDossier[dId]) {
    //       // Initialize count object with all titles = 0
    //       byDossier[dId] = {};
    //       allTitles.forEach((t) => (byDossier[dId][t] = 0));
    //     }

    //     // Increase count for this title in this dossier
    //     byDossier[dId][title] = (byDossier[dId][title] || 0) + 1;
    //   }

    //   notifCount.set(userId, byDossier);
    // }

    for (const [userId, notifs] of dict.entries()) {
      // Initialize empty object for userId
      notifCount.set(userId, {});

      // Group notifications by dossierId first
      const byDossier = {};

      for (const notif of notifs) {
        // Only count unread notifications
        if (!notif.isRead) {
          const dId = notif.dossierId;
          const title = notif.title;

          if (!byDossier[dId]) {
            // Initialize count object with all titles = 0
            byDossier[dId] = {};
            allTitles.forEach((t) => (byDossier[dId][t] = 0));
          }

          // Increase count for this title in this dossier
          byDossier[dId][title] = (byDossier[dId][title] || 0) + 1;
        }
      }

      notifCount.set(userId, byDossier);
    }

    // Then emit notifications counts for given gestionnaire ids
    for (const id of idGest) {
      io.emit("NotifCount", { userId: id, count: notifCount.get(id) || {} });
    }
    console.log("Notification count : ", notifCount);
    notifications = [];
    idGest = new Set();
    return res.status(200).send("Cadrage effectué par succès");
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send(`Error importing Cadrage data : ${err.message}`);
  }
};

const cadrageAddresse = async (addresses, marche) => {
  const t = await connection.transaction();
  try {
    for (const addresse of addresses) {
      await Debiteur_Addresse.create({
        addresseDebiteur: addresse.adresse,
        debiteurId: addresse.CIN,
        ville: addresse.ville,
        marche: Number(marche),
      });
      await Dossier.update(
        { cadrage: "OUI" },
        { where: { debiteurId: addresse.CIN, clientId: marche } }
      );

      await Historique.create({
        debiteur_ID: addresse.CIN,
        nature: "Cadrage Adresse",
        date_confirmation: new Date(),
        status: "GENEREE",
      });

      const redisData = await redisClient.get(redisKey);
      const redisDataParsed = JSON.parse(redisData);

      for (const dossier of redisDataParsed.redisStructure) {
        if (
          dossier.dossier.debiteurId == addresse.CIN &&
          dossier.dossier.clientId == marche
        ) {
          Object.assign(dossier.dossier, {
            cadrage: "OUI",
          });
        }
      }
      await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

      const results = await Dossier.findAll({
        where: { debiteurId: addresse.CIN, clientId: marche },
        attributes: ["gestionnaireId", "NDossier", "id"],
        raw: true, // <- makes results plain JS objects
      });
      for (const result of results) {
        idGest.add(result.gestionnaireId);
        notifications.push({
          title: "Cadrage Adresse",
          message: `Cadrage Addresse effectué dans le dossier N° ${result.NDossier}`,
          isRead: false,
          id: result.gestionnaireId,
          dossierId: result.id,
        });
      }
    }
    await t.commit();
  } catch (err) {
    await t.rollback();
    console.log(err.message);
  }
};

const cadragePatrimoins = async (patrimoins, marche) => {
  const t = await connection.transaction();
  try {
    for (const patrimoin of patrimoins) {
      await Debiteur_Patrimoine.create({
        ville: patrimoin.ville,
        type: patrimoin.type,
        NBRE_TF: patrimoin.NBRE_TF,
        Nom: patrimoin.Nom,
        NomF: patrimoin.NomF,
        titre: patrimoin.titre,
        H: patrimoin.H,
        Are: patrimoin.Are,
        CA: patrimoin.CA,
        Quote: patrimoin.Quote,
        debiteurId: patrimoin.debiteurId.toUpperCase(),
        Part: patrimoin.Part,
        Pdite: patrimoin.Pdite,
        marche: Number(marche),
        AdrProp: patrimoin.AdrProp,
        Consistance: patrimoin.Consistance,
      });
      await Dossier.update(
        { cadrage: "OUI" },
        { where: { debiteurId: patrimoin.debiteurId, clientId: marche } }
      );
      await Historique.create({
        debiteur_ID: patrimoin.debiteurId,
        nature: "Cadrage Patrimoine",
        date_confirmation: new Date(),
        status: "GENEREE",
      });
      const redisData = await redisClient.get(redisKey);
      const redisDataParsed = JSON.parse(redisData);

      for (const dossier of redisDataParsed.redisStructure) {
        if (
          dossier.dossier.debiteurId == patrimoin.debiteurId &&
          dossier.dossier.clientId == marche
        ) {
          Object.assign(dossier.dossier, {
            cadrage: "OUI",
          });
        }
      }
      await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

      const results = await Dossier.findAll({
        where: { debiteurId: patrimoin.debiteurId, clientId: marche },
        attributes: ["gestionnaireId", "NDossier", "id"],
        raw: true, // <- makes results plain JS objects
      });
      for (const result of results) {
        idGest.add(result.gestionnaireId);
        notifications.push({
          title: "Cadrage Patrimoine",
          message: `Cadrage Patrimoine effectué dans le dossier N° ${result.NDossier}`,
          isRead: false,
          id: result.gestionnaireId,
          dossierId: result.id,
        });
      }
    }

    await t.commit();
  } catch (err) {
    await t.rollback();
    console.log(err.message);
  }
};

const cadrageBanque = async (banques, marche) => {
  console.log("marche inside cadrageBanque : ", marche);
  const t = await connection.transaction();
  try {
    for (const banque of banques) {
      await Debiteur_Banque.create({
        nom: banque.nom,
        debiteurId: banque.debiteurId.toUpperCase(),
        solde: parseFloat(banque.solde),
        Tel_Domicile: banque.Tel_Domicile,
        RIB: banque.RIB,
        Date: banque.Date ? moment(banque.Date).format("YYYY-MM-DD") : null,
        Date_mouvement: banque.Date_mouvement
          ? moment(banque.Date_mouvement).format("YYYY-MM-DD")
          : null,
        marche: Number(marche),
      });
      await Dossier.update(
        { cadrage: "OUI" },
        { where: { debiteurId: banque.debiteurId, clientId: marche } }
      );

      await Historique.create({
        debiteur_ID: banque.debiteurId,
        nature: "Cadrage Banque",
        date_confirmation: new Date(),
        status: "GENEREE",
      });

      const redisData = await redisClient.get(redisKey);
      const redisDataParsed = JSON.parse(redisData);

      for (const dossier of redisDataParsed.redisStructure) {
        if (
          dossier.dossier.debiteurId == banque.debiteurId &&
          dossier.dossier.clientId == marche
        ) {
          Object.assign(dossier.dossier, {
            cadrage: "OUI",
          });
        }
      }
      await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

      const results = await Dossier.findAll({
        where: { debiteurId: banque.debiteurId, clientId: marche },
        attributes: ["gestionnaireId", "NDossier", "id"],
        raw: true, // <- makes results plain JS objects
      });
      for (const result of results) {
        idGest.add(result.gestionnaireId);
        notifications.push({
          title: "Cadrage Banque",
          message: `Cadrage Banque effectué dans le dossier N° ${result.NDossier}`,
          isRead: false,
          id: result.gestionnaireId,
          dossierId: result.id,
        });
      }
    }

    await t.commit();
    // return true
  } catch (err) {
    console.log(err.message);
    await t.rollback();
    // return false
  }
};

const cadrageEmployeur = async (employeurs, marche) => {
  const t = await connection.transaction();
  try {
    for (const employeur of employeurs) {
      await Debiteur_Employeur_Cadrage.create({
        id: employeur.id,
        RS: employeur.RS,
        AVT: employeur.AVT,
        AD_STE: employeur.AD_STE,
        V_STE: employeur.V_STE,
        NUM_SAL: employeur.NUM_SAL,
        NM: employeur.NM,
        PR: employeur.PR,
        AD_SAL: employeur.AD_SAL,
        V_SAL: employeur.V_SAL,
        PRD: employeur.PRD,
        JR: employeur.JR,
        SLR: employeur.SLR,
        ML: employeur.ML,
        TL: employeur.TL,
        debiteurId: employeur.debiteurId.toUpperCase(),
        marche: Number(marche),
      });
      await Dossier.update(
        { cadrage: "OUI" },
        { where: { debiteurId: employeur.debiteurId, clientId: marche } }
      );

      await Historique.create({
        debiteur_ID: employeur.debiteurId,
        nature: "Cadrage CNSS",
        date_confirmation: new Date(),
        status: "GENEREE",
      });

      const redisData = await redisClient.get(redisKey);
      const redisDataParsed = JSON.parse(redisData);

      for (const dossier of redisDataParsed.redisStructure) {
        if (
          dossier.dossier.debiteurId == employeur.debiteurId &&
          dossier.dossier.clientId == marche
        ) {
          Object.assign(dossier.dossier, {
            cadrage: "OUI",
          });
        }
      }
      await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

      const results = await Dossier.findAll({
        where: { debiteurId: employeur.debiteurId, clientId: marche },
        attributes: ["gestionnaireId", "NDossier", "id"],
        raw: true, // <- makes results plain JS objects
      });
      for (const result of results) {
        idGest.add(result.gestionnaireId);
        notifications.push({
          title: "Cadrage CNSS",
          message: `Cadrage CNSS effectué dans le dossier N° ${result.NDossier}`,
          isRead: false,
          id: result.gestionnaireId,
          dossierId: result.id,
        });
      }
    }

    await t.commit();
  } catch (err) {
    console.log(err.message);
    await t.rollback();
  }
};

const cadrageTele = async (tele, marche) => {
  const t = await connection.transaction();
  try {
    for (const tel of tele) {
      let debiteur = await Debiteur.findOne({
        where: { CIN: tel.CIN },
        attributes: ["CIN", "debiteur_tel1", "debiteur_tel2"],
        raw: true,
      });
      console.log(tel);
      if (tel.Tel1 !== "" && debiteur.debiteur_tel1 == "") {
        console.log("tel1");
        await Debiteur.update(
          { debiteur_tel1: tel.Tel1 },
          { where: { CIN: debiteur.CIN.toUpperCase() } }
        );
      }
      if (tel.Tel2 !== "" && debiteur.debiteur_tel2 == "") {
        console.log("tel2");
        await Debiteur.update(
          { debiteur_tel2: tel.Tel2 },
          { where: { CIN: debiteur.CIN } }
        );
      }
      await Dossier.update(
        { cadrage: "OUI" },
        { where: { debiteurId: tel.CIN, clientId: marche } }
      );
      await Historique.create({
        debiteur_ID: employeur.debiteurId,
        nature: "Cadrage Téléphonique",
        date_confirmation: new Date(),
        status: "GENEREE",
      });
      const redisData = await redisClient.get(redisKey);
      const redisDataParsed = JSON.parse(redisData);

      for (const dossier of redisDataParsed.redisStructure) {
        if (
          dossier.dossier.debiteurId == tel.CIN &&
          dossier.dossier.clientId == marche
        ) {
          Object.assign(dossier.dossier, {
            cadrage: "OUI",
          });
        }
      }
      await redisClient.set(redisKey, JSON.stringify(redisDataParsed));
      const results = await Dossier.findAll({
        where: { debiteurId: tel.CIN, clientId: marche },
        attributes: ["gestionnaireId", "NDossier", "id"],
        raw: true, // <- makes results plain JS objects
      });
      for (const result of results) {
        idGest.add(result.gestionnaireId);
        notifications.push({
          title: "Cadrage Téléphonique",
          message: `Cadrage Téléphonique effectué dans le dossier N° ${result.NDossier}`,
          isRead: false,
          id: result.gestionnaireId,
          dossierId: result.id,
        });
      }
    }

    await t.commit();
  } catch (err) {
    await t.rollback();
    console.log(err.message);
  }
};

module.exports = { importCadrage, dict, notifCount };
