const Action = require("../models/Action.js");
const Admin = require("../models/Admin.js");
const Dossier = require("../models/Dossier.js");
const { Op } = require("sequelize");
const connection = require("../config/db.js");
const { QueryTypes } = require("sequelize");
const moment = require("moment");
const { fetchDossiersAgenda } = require("./agendaController.js");
const Gestionnaire = require("../models/Gestionnaire.js");
const Debiteur = require("../models/Debiteur.js");
const Client = require("../models/Client.js");
const Responsable = require("../models/Responsable.js");

const redisClient = require("../config/redis.js");
const redisKey = "2002_KAFKA";
const saveDossier = async (
  NDossier,
  categorie,
  type,
  clientId,
  statusId,
  etat,
  debiteurId,
  creanceId,
  gestionnaireId
) => {
  try {
    const dossier = await Dossier.create({
      NDossier,
      categorie,
      type,
      etat,
      clientId,
      statusId,
      debiteurId,
      creanceId,
      gestionnaireId,
    });

    console.log("✅ Dossier saved:", dossier.NDossier);
    return dossier; // ✅ return it
  } catch (err) {
    console.log("❌ Error saving Dossier:", err.message);
    throw err;
  }
};

const checkIfDossierIsBacklog = async (io) => {
  try {
    const now = new Date().toISOString().split("T")[0];
    const updatedManagers = new Set();
    const updatedGestionnaires = new Set();
    const dossiers = await Dossier.findAll({
      where: {
        etat: { [Op.in]: ["Action à traiter", "Nouvelles Actions"] },
      },
    }).then((results) =>
      results.map((g) => ({
        id: g.id,
        date: g.date_prevu,
        responsableId: g.responsableId,
        gestionnaireId: g.gestionnaireId,
      }))
    );
    if (dossiers.length === 0) {
      return;
    }
    for (const dossier of dossiers) {
      if (dossier.date <= now) {
        if (dossier.responsableId !== null && dossier.gestionnaireId !== "") {
          updatedManagers.add(dossier.responsableId);
        }
        if (dossier.gestionnaireId !== null && dossier.gestionnaireId !== "") {
          updatedGestionnaires.add(dossier.gestionnaireId);
        }
        await Dossier.update(
          { etat: "Actions en backlog", etatResponsable: "Actions en backlog" },
          { where: { id: dossier.id } }
        );
      }
    }

    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);

    for (const dossier of redisDataParsed.redisStructure) {
      const dossierDate = new Date(dossier.dossier.date_prevu).toISOString().split("T")[0];
      if ((dossier.dossier.etat === "Action à traiter" || dossier.dossier.etat === "Nouvelles actions") && dossierDate <= now) {
        Object.assign(dossier.dossier, {
         etat: "Actions en backlog", etatResponsable: "Actions en backlog" },
        );
      }
    }
    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));
    const admineIds = await Admin.findAll({
      where: {},
      attributes: ["id"],
    }).then((results) => results.map((g) => ({ id: g.id })));

    for (const id of admineIds) {
      let updatedDossiersAdmin = await fetchDossiersAgenda(id, "ADMIN");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersAdmin,
        id: id,
        role: "ADMIN",
      });
    }
    for (const respo of updatedManagers) {
      const updatedDossiersRespo = await fetchDossiersAgenda(
        respo,
        "RESPONSABLE"
      );
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersRespo,
        id: respo,
        role: "RESPONSABLE",
      });
    }

    for (const gest of updatedGestionnaires) {
      let updatedDossiers = await fetchDossiersAgenda(gest, "GESTIONNAIRE");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiers,
        id: gest,
        role: "GESTIONNAIRE",
      });
    }
  } catch (err) {
    console.log("❌ Error checking if Dossier is backlog:", err.message);
  }
};

const checkIfDossierShouldBeTreatedToday = async (io) => {
  const now = moment(new Date()).format("YYYY-MM-DD");
  const updatedManagers = new Set();
  const updatedGestionnaires = new Set();
  try {
    // const now = new Date();
    const dossiers = await Dossier.findAll({
      where: {
        etat: "Actions en cours",
      },
    }).then((results) =>
      results.map((g) => ({
        id: g.id,
        date: g.createdAt,
        responsableId: g.responsableId,
        gestionnaireId: g.gestionnaireId,
        date_prevu: g.date_prevu,
      }))
    );
    if (dossiers.length === 0) {
      return;
    }
    for (const dossier of dossiers) {
      if (now === dossier.date_prevu) {
        if (dossier.responsableId !== null && dossier.gestionnaireId !== "") {
          updatedManagers.add(dossier.responsableId);
        }
        if (dossier.gestionnaireId !== null && dossier.gestionnaireId !== "") {
          updatedGestionnaires.add(dossier.gestionnaireId);
        }
        await Dossier.update(
          { etat: "Action à traiter" , etatResponsable: "Action à traiter"},
          { where: { id: dossier.id } }
        );
      }
    }

    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);

    for (const dossier of redisDataParsed.redisStructure) {
      const dossierDate = new Date(dossier.dossier.date_prevu).toISOString().split("T")[0];
      if (dossier.dossier.etat === "Actions en cours" && dossierDate == now) {
        Object.assign(dossier.dossier, {
         etat: "Action à traiter", etatResponsable: "Action à traiter" },
        );
      }
    }
    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

    const admineIds = await Admin.findAll({
      where: {},
      attributes: ["id"],
    }).then((results) => results.map((g) => ({ id: g.id })));
    for (const id of admineIds) {
      let updatedDossiersAdmin = await fetchDossiersAgenda(id, "ADMIN");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersAdmin,
        id: id,
        role: "ADMIN",
      });
    }
    for (const respo of updatedManagers) {
      const updatedDossiersRespo = await fetchDossiersAgenda(
        respo,
        "RESPONSABLE"
      );
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersRespo,
        id: respo,
        role: "RESPONSABLE",
      });
    }

    for (const gest of updatedGestionnaires) {
      let updatedDossiers = await fetchDossiersAgenda(gest, "GESTIONNAIRE");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiers,
        id: gest,
        role: "GESTIONNAIRE",
      });
    }
  } catch (err) {
    console.log(
      "❌ Error checking if Dossier should be treated today: ",
      err.message
    );
  }
};


const searchDossiers = async (req, res) => {
  try {
    const search = req.query.search || ""; // from query parameter

    const dossiers = await Gestionnaire.findAll({
      attributes: ["username"],
      include: [
        {
          model: Dossier,
          attributes: ["NDossier"],
          include: [
            {
              model: Client,
              attributes: ["marche"],
              where: search
                ? {
                    nom: {
                      [Op.like]: `%${search}%`,
                    },
                  }
                : undefined,
            },
            {
              model: Debiteur,
              attributes: ["CIN", "nom"],
              where: search
                ? {
                    CIN: {
                      [Op.like]: `%${search}%`,
                    },
                  }
                : undefined,
            },
          ],
          where: search
            ? {
                [Op.or]: [
                  { NDossier: { [Op.like]: `%${search}%` } },
                  { marche: { [Op.like]: `%${search}%` } },
                ],
              }
            : undefined,
        },
      ],
    });

    res.json(dossiers);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDossierDetails = async (req, res) => {
  try {
    const cin = req.query.cin; // example: /api/dossier/details?ndossier=67212669817
    if (!cin) {
      return res.status(400).json({ message: "cin is required" });
    }
    const results = await connection.query(
      `
      SELECT 
          dossier.NDossier, 
          dossier.id,
          debiteur.nom AS debiteur_nom, 
          debiteur.CIN,
          dossier.clientId,
          dossier.createdAt, 
          gestionnaire.username AS "Gestionnaire", 
          responsable.username AS "Manager"
              FROM dossier
              LEFT JOIN debiteur ON dossier.debiteurId = debiteur.CIN
              LEFT JOIN gestionnaire ON dossier.gestionnaireId = gestionnaire.id
              LEFT JOIN responsable ON dossier.responsableId = responsable.id
              WHERE dossier.debiteurId = :cin;
    `,
      {
        replacements: { cin },
        type: QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (error) {
    console.error("Error fetching dossier details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const affecterDossiers = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    const { ids, idGest } = req.body;
    console.log(ids);
    console.log(idGest);
    const manager = await Gestionnaire.findOne({
      where: { id: idGest },
      attributes: ["responsableId","username","id"],
    });
    const responsable = await Responsable.findOne({
      where:{id:manager.responsableId},
      attributes : ["username"]
    })
    await Dossier.update(
      {
        etat: "Nouvelles actions",
        etatResponsable: "Nouvelles actions",
        gestionnaireId: idGest,
        responsableId: manager.responsableId,
      },
      { where: { id: ids } } // Sequelize accepts an array here
    );

    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);

    // Loop through redisStructure and update all matching dossier IDs
    for (const dossier of redisDataParsed.redisStructure) {
      if (ids.includes(dossier.dossier.id)) {
        Object.assign(dossier.dossier, {
          etat: "Nouvelles actions",
          etatResponsable: "Nouvelles actions",
          gestionnaireId: idGest,
          responsableId: manager.responsableId,
        });
        dossier.gestionnaire = manager.username;
        dossier.gestionnaireId = manager.id;
        dossier.manager = responsable.username;
      }
    }

    // Save back updated cache
    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

    const io = req.app.get("io");

    let updatedDossiersResp = await fetchDossiersAgenda(
      manager.responsableId,
      "RESPONSABLE"
    );
    const emmited = {
      dossiers: updatedDossiersResp,
      id: manager.responsableId,
      role: "RESPONSABLE",
    };
    io.emit("dossiersAgendaData", emmited);

    let updatedDossiersGest = await fetchDossiersAgenda(idGest, "GESTIONNAIRE");
    io.emit("dossiersAgendaData", {
      dossiers: updatedDossiersGest,
      id: idGest,
      role: "GESTIONNAIRE",
    });

    const admineIds = await Admin.findAll({
      where: {},
      attributes: ["id"],
    }).then((results) => results.map((g) => ({ id: g.id })));

    for (const id of admineIds) {
      let updatedDossiersAdmin = await fetchDossiersAgenda(id, "ADMIN");
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersAdmin,
        id: id,
        role: "ADMIN",
      });
    }

    return res
      .status(200)
      .json({ message: "Les dossiers sont affectés avec succès" });
  } catch (err) {
    console.log("❌ Error while affecting dossiers: ", err.message);
    return res
      .status(500)
      .send(`Internal Server Error in affecterDossiers : ${err.message}}`);
  }
};

module.exports = {
  saveDossier,
  checkIfDossierIsBacklog,
  searchDossiers,
  checkIfDossierShouldBeTreatedToday,
  getDossierDetails,
  affecterDossiers,
};
