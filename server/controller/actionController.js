const Action = require("../models/Action");
const Admin = require("../models/Admin");
const Dossier = require("../models/Dossier");
const FamilleAction = require("../models/FamilleAction");
const ListeAction = require("../models/ListeAction");
const Timeline = require("../models/Timeline");
const { fetchDossiersAgenda } = require("./agendaController");
const connection = require("../config/db.js");
const { punchStatistics } = require("./pilotageCommissionController.js");

const redisClient = require("../config/redis.js");
const redisKey = "2002_KAFKA";

const createAction = async (req, res) => {
  const role = req.role;
  if (role === "VISITEUR") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const { idGest, idManager } = req.body;
    const { newAction } = req.body;
    console.log(req.body);
    const savedAction = await Action.create({
      action: newAction.action,
      familleAction: newAction.familleAction,
      actionSuivante: newAction.actionSuivante,
      detail: newAction.detail,
      dateExecution: newAction.dateExecution,
      dateActionSuivante: newAction.dateActionSuivante,
      nouveauStatus: newAction.nouveauStatus,
      sort: newAction.sort,
      dossierId: newAction.dossierId,
    });

    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);
    const dossier = redisDataParsed.redisStructure.find(
      (d) => d.dossier.id == newAction.dossierId // use == to handle number/string mismatch
    );

    if (dossier) {
      // Add new property or push into array
      dossier.actions.push({
        id: savedAction.id,
        action: savedAction.action,
        detail: savedAction.detail,
        familleAction: savedAction.familleAction,
        actionSuivante: savedAction.actionSuivante,
        dateExecution: savedAction.dateExecution,
        dateActionSuivante: savedAction.dateActionSuivante,
        nouveauStatus: savedAction.nouveauStatus,
        sort: savedAction.sort,
        dossierId: savedAction.dossierId,
      });

      dossier.dossier = {
        ...dossier.dossier,
        status: savedAction.nouveauStatus,
        etat: "Actions en cours",
        etatResponsable: "Actions en cours",
        date_prevu: savedAction.dateActionSuivante,
      };
    }

    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

    await Dossier.update(
      {
        status: newAction.nouveauStatus,
        etat: "Actions en cours",
        etatResponsable: "Actions en cours",
        date_prevu: newAction.dateActionSuivante,
      },
      { where: { id: newAction.dossierId } }
    );


    await Timeline.create({
      status_timeline: newAction.nouveauStatus,
      dossierId: newAction.dossierId,
    });
    const io = req.app.get("io");

    let statis = await punchStatistics();
    io.emit("plotage_commission", statis);

    // const admineIds = await Admin.findAll({
    //   where: {},
    //   attributes: ["id"],
    // }).then((results) => results.map((g) => ({ id: g.id })));

    if (role === "GESTIONNAIRE") {
      const updatedDossiersGest = await fetchDossiersAgenda(
        idGest,
        "GESTIONNAIRE"
      );
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersGest,
        id: idGest,
        role: "GESTIONNAIRE",
      });
    }

    if (role === "RESPONSABLE") {
      const updatedDossiersGest = await fetchDossiersAgenda(
        idManager,
        "RESPONSABLE"
      );
      io.emit("dossiersAgendaData", {
        dossiers: updatedDossiersGest,
        id: idManager,
        role: "RESPONSABLE",
      });
    }

    return res.status(200).json({ message: "Action créée avec succès" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};

const getActions = async (req, res) => {
  const { dossierId } = req.body;
  try {
    const actions = await Action.findAll({ where: { dossierId } });
    return res.status(200).json(actions);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ message: "Une erreur de système est survenue" });
  }
};

const getActionsParFamille = async (req, res) => {
  const familleAction = req.params.familleAction;
  try {
    const listeActions = await ListeAction.findAll({
      where: { familleId: familleAction },
    });
    return res.status(200).send(listeActions);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ message: "Une erreur de système est survenue" });
  }
};

const getFamillesAction = async (req, res) => {
  try {
    const listeFamilles = await FamilleAction.findAll();
    return res.status(200).send(listeFamilles);
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Une erreur de système est survenue" });
  }
};

const getActionsGrouped = async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT famille_action.familleAction, liste_action.nomAction 
      FROM famille_action
      INNER JOIN liste_action 
      ON famille_action.id = liste_action.familleId
      WHERE liste_action.visibility = 1 AND famille_action.visibility = 1
    `);

    // Group by familleAction
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.familleAction]) {
        acc[row.familleAction] = [];
      }
      acc[row.familleAction].push(row.nomAction);
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  createAction,
  getActions,
  getActionsParFamille,
  getFamillesAction,
  getActionsGrouped,
};
