require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const morgan = require("morgan");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as needed for production
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
const authRoutes = require("./routes/authGestionnaireRoute.js");
const connection = require("./config/db");
const auth = require("./middlewares/auth");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Models
const Dossier = require("./models/Dossier.js");
const Creance = require("./models/Creance.js");
const Debiteur = require("./models/Debiteur.js");
const Client = require("./models/Client.js");
const Status = require("./models/Status.js");
const Timeline = require("./models/Timeline.js");
const Encaissement = require("./models/Encaissement.js");
const Piece_jointe = require("./models/Piece_jointe.js");
const Debiteur_Addresse = require("./models/Debiteur_Address.js");
const Debiteur_Cautionneur = require("./models/Debiteur_Cautionneur.js");
const Dossier_Commentaire = require("./models/Dossier_Commentaire.js");
const Debiteur_Patrimoine = require("./models/Debiteur_Patrimoine.js");
const Debiteur_Employeur = require("./models/Debiteur_Employeur.js");
const Debiteur_Retraite = require("./models/Debiteur_Retraite.js");
const Debiteur_Conjoint = require("./models/Debiteur_Conjoint.js");
const UserLogs = require("./models/UserLogs.js");
const ListeAction = require("./models/ListeAction.js");
const Visiteur = require("./models/Visiteur.js");
const Admin = require("./models/Admin.js");
const Demande_Cadrage = require("./models/Demande_Cadrage.js");
const Gestionnaire = require("./models/Gestionnaire.js");
const Responsable = require("./models/Responsable.js");
const Action = require("./models/Action.js");
const Lot = require("./models/Lot.js");
const Debiteur_Banque = require("./models/Debiteur_Banque.js");
const Debiteur_Employeur_Cadrage = require("./models/Debiteur_Employeur_Cadrage.js");
const Archive = require("./models/Archive.js");
const FamilleAction = require("./models/FamilleAction.js");
const TypeReglement = require("./models/TypeReglement.js");
const ModelReglement = require("./models/ModeReglement.js");
const Sort = require("./models/Sort.js");
const Objectif = require("./models/Objectifs.js");
const Historique = require("./models/Historique.js");

// Import Routes
const adminRoute = require("./routes/adminRoute.js");
const authGestionnaireRoute = require("./routes/authGestionnaireRoute.js");
const importData = require("./routes/importRoute.js");
const debiteurRoute = require("./routes/debiteurRoute.js");
const creanceRoute = require("./routes/creanceRoute.js");
const cadargeRoute = require("./routes/cadrageRoute.js");
const responsableRoute = require("./routes/responsableRoute.js");
const gestionnaireRoute = require("./routes/gestionnaireRoute.js");
const authRoute = require("./routes/authRoute.js");
const importExcelRoute = require("./routes/importRoute.js");
const agendaRoute = require("./routes/agendaRoute.js");
const { saveAdmin } = require("./controller/adminController.js");
const { fetchDossiersAgenda } = require("./controller/agendaController.js");
const userRoute = require("./routes/UserRoute.js");
const parametrageRoute = require("./routes/parametrageRoute.js");
const commentaireRoute = require("./routes/commentaireRoute.js");
const visiteurRoute = require("./routes/visiteurRoute.js");
const encaissementRoute = require("./routes/encaissementRoute.js");
const actionRoute = require("./routes/actionRoute.js");
const timelineRoute = require("./routes/timelineRoute.js");
const pieceJointeRoute = require("./routes/pieceJointeRoute.js");
const uploadRoute = require("./routes/uploadRoute.js");
const dossierRoute = require("./routes/dossierRoute.js");
const employeurRoute = require("./routes/employeurRoute.js");
const cautionneurRoute = require("./routes/cautionneurRoute.js");
const banqueRoute = require("./routes/BanqueRoute.js");
const patrimoinRoute = require("./routes/patrimoinsRoute.js");
const historiqueRouter = require("./routes/historiqueRoute.js");

const { verifyEmail } = require("./services/verifyEmail.js");

const { setNewData, getNewData } = require("./controller/importController.js");

const cors = require("cors");
const {
  getGestionnairesId,
  fetchUsers,
} = require("./controller/gestionnaireController.js");
const {
  checkIfDossierIsBacklog,
  checkIfDossierShouldBeTreatedToday,
} = require("./controller/dossierController.js");
const { Http2ServerRequest, Http2ServerResponse } = require("http2");

require("./docs/swagger")(app);

// Middlewares
//app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`, // Replace with your Next.js frontend URL
    credentials: true, // ✅ Allow cookies to be sent
  })
);
app.set("io", io);
// Mounting routes
app.use("/api/gestionnaire/auth", authGestionnaireRoute);
app.use("/import", importData);
app.use("/debiteur", debiteurRoute);
app.use("/creance", creanceRoute);
app.use("/cadrage", cadargeRoute);
app.use("/responsable", responsableRoute);
app.use("/gestionnaire", gestionnaireRoute);
app.use("/auth", authRoute);
app.use("/assign", importExcelRoute);
app.use("/agenda", agendaRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/parametrage", parametrageRoute);
app.use("/commentaire", commentaireRoute);
app.use("/visiteur", visiteurRoute);
app.use("/encaissement", encaissementRoute);
app.use("/action", actionRoute);
app.use("/timeline", timelineRoute);
app.use("/piece_jointe", pieceJointeRoute);
app.use("/upload", uploadRoute);
app.use("/dossier", dossierRoute);
app.use("/employeur", employeurRoute);
app.use("/cautionneur", cautionneurRoute);
app.use("/banque", banqueRoute);
app.use("/patrimoin", patrimoinRoute);
app.use("/historique", historiqueRouter);

// Les relations

Debiteur.hasMany(Dossier, { foreignKey: "debiteurId", as: "dossiers" });
Dossier.belongsTo(Debiteur, { foreignKey: "debiteurId", as: "debiteur" });

FamilleAction.hasMany(ListeAction, {
  foreignKey: "familleId",
  as: "famille_action",
});
ListeAction.belongsTo(FamilleAction, {
  foreignKey: "familleId",
  as: "action_famille",
});

Debiteur.hasMany(Debiteur_Employeur_Cadrage, {
  foreignKey: "debiteurId",
  as: "debiteur_cadrage_empl",
});
Debiteur_Employeur_Cadrage.belongsTo(Debiteur, {
  foreignKey: "debiteurId",
  as: "cadrage_empl_debiteur",
});

Debiteur.hasMany(Debiteur_Banque, {
  foreignKey: "debiteurId",
  as: "debiteur_banque",
});
Debiteur_Banque.belongsTo(Debiteur, {
  foreignKey: "debiteurId",
  as: "banque_debiteur",
});

Lot.hasMany(Dossier, { foreignKey: "lotId", as: "lot_dossiers" });
Dossier.belongsTo(Debiteur, { foreignKey: "lotId", as: "dossier_lot" });

Creance.hasOne(Dossier, { foreignKey: "creanceId", as: "dossier" });
Dossier.belongsTo(Creance, { foreignKey: "creanceId", as: "creance" });

Client.hasMany(Dossier, { foreignKey: "clientId", as: "dossiers" });
Dossier.belongsTo(Client, { foreignKey: "clientId", as: "client" });

Dossier.belongsToMany(Timeline, {
  through: "DossierTimelines",
  foreignKey: "dossierId",
  otherKey: "timelineId",
  as: "timelines",
});
Timeline.belongsToMany(Dossier, {
  through: "DossierTimelines",
  foreignKey: "timelineId",
  otherKey: "dossierId",
  as: "dossiers",
});

Dossier.hasMany(Encaissement, { foreignKey: "dossierId", as: "encaissement" });
Encaissement.belongsTo(Dossier, { foreignKey: "dossierId", as: "dossier" });

Dossier.hasMany(Timeline, { foreignKey: "dossierId", as: "timeline_dossier" });
Timeline.belongsTo(Dossier, { foreignKey: "dossierId", as: "dossier_dossier" });

Dossier.hasMany(Piece_jointe, {
  foreignKey: "dossierId",
  as: "piece_jointe_dossier",
});
Piece_jointe.belongsTo(Dossier, {
  foreignKey: "dossierId",
  as: "dossier_piece_jointe",
});

Debiteur.hasMany(Debiteur_Cautionneur, {
  foreignKey: "debiteurId",
  as: "debiteur_ca",
});
Debiteur_Cautionneur.belongsTo(Debiteur, {
  foreignKey: "debiteurId",
  as: "debiteur_debiteur_cautionneur",
});

Debiteur.hasMany(Debiteur_Addresse, {
  foreignKey: "debiteurId",
  as: "debiteur_addresse",
});
Debiteur_Addresse.belongsTo(Debiteur, {
  foreignKey: "debiteurId",
  as: "addresse_debiteur",
});

Dossier.hasMany(Dossier_Commentaire, {
  foreignKey: "dossierId",
  as: "debiteur_comme",
});
Dossier_Commentaire.belongsTo(Dossier, {
  foreignKey: "dossierId",
  as: "commentaire_deb",
});

Debiteur.hasMany(Debiteur_Patrimoine, {
  foreignKey: "debiteurId",
  as: "debiteur_patrimoins",
});
Debiteur_Patrimoine.belongsTo(Debiteur, {
  foreignKey: "debiteurId",
  as: "patrimoins_debiteur",
});

Debiteur.hasMany(Debiteur_Employeur, {
  foreignKey: "debiteurId",
  as: "debiteur_employeur",
});
Debiteur_Employeur.belongsTo(Debiteur, {
  foreignKey: "debiteurId",
  as: "employeur_debiteur",
});

Debiteur.hasOne(Debiteur_Retraite, {
  foreignKey: "debiteurId",
  as: "retraite_debiteur",
});
Debiteur_Retraite.belongsTo(Debiteur, {
  foreignKey: "debiteurId",
  as: "debiteur_retraite",
});

Archive.hasOne(Dossier, {
  foreignKey: "dossierId",
  as: "archive_dossier",
});
Dossier.belongsTo(Archive, {
  foreignKey: "dossierId",
  as: "dossier_archive",
});

Debiteur.hasMany(Debiteur_Conjoint, {
  foreignKey: "debiteurId",
  as: "debiteur_conjoint",
});
Debiteur_Conjoint.belongsTo(Debiteur, {
  foreignKey: "debiteurId",
  as: "conjoint_debiteur",
});

Dossier.hasMany(Demande_Cadrage, {
  foreignKey: "dossierId",
  as: "dossier_cadrage",
});
Demande_Cadrage.belongsTo(Dossier, {
  foreignKey: "dossierId",
  as: "cadrage_dossier",
});

Gestionnaire.hasMany(Dossier, {
  foreignKey: "gestionnaireId",
  as: "gestionnaire_dossier",
});
Dossier.belongsTo(Gestionnaire, {
  foreignKey: "gestionnaireId",
  as: "dossier_gestionnaire",
});

Responsable.hasMany(Gestionnaire, {
  foreignKey: "responsableId",
  as: "responsable_gestionnaire",
});
Gestionnaire.belongsTo(Responsable, {
  foreignKey: "responsableId",
  as: "gestionnaire_responsable",
});

Responsable.hasMany(Dossier, {
  foreignKey: "responsableId",
  as: "responsable_dossier",
});
Dossier.belongsTo(Responsable, {
  foreignKey: "responsableId",
  as: "dossier_responsable",
});

Dossier.hasMany(Action, { foreignKey: "dossierId", as: "dossier_action" });
Action.belongsTo(Dossier, { foreignKey: "dossierId", as: "action_dossier" });

const IO = app.get("io");

//////////////// Cron jobs //////////////////////

const cron = require("node-cron");
cron.schedule("00 23 * * *", async (req, res) => {
  console.log("Running scheduled task at 23:00");
  try {
    console.log("checkIfDossierIsBacklog is triggered !!");
    await checkIfDossierIsBacklog(IO);
  } catch (err) {
    console.error("Scheduled task error:", err.message);
  }
});

cron.schedule("01 00 * * *", async (req, res) => {
  console.log("Running scheduled task at 23:00");
  try {
    console.log("checkIfDossierShouldBeTreatedToday is triggered !!");
    await checkIfDossierShouldBeTreatedToday(IO);
  } catch (err) {
    console.error("Scheduled task error:", err.message);
  }
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
let start = false;
connection
  .authenticate()
  .then(() => {
    console.log("Connection to MySQL has been established successfully.");
    return connection.sync({ alter: true }); // WARNING: This will drop existing tables and recreate them! Use with caution in production.
  })
  .then(() => {
    server.listen(PORT, HOST, async () => {
      console.log(`Server running with WebSocket on http://${HOST}:${PORT}`);
      const countLot = await Lot.count();
      const countClient = await Client.count();
      const countSort = await Sort.count();
      const countAction = await Action.count();
      const adminExists = await Admin.count();
      const countFamilleAction = await FamilleAction.count();
      const countStatut = await Status.count();
      const counttypeReg = await TypeReglement.count();
      const countmodeReg = await ModelReglement.count();
      if (countLot == 0) {
        [1, 2].map(
          async (lot) => await Lot.create({ Nlot: lot, visibility: 1 })
        );
      }
      if (countClient == 0) {
        [{ marche: "CIH Bank", commission: 5 }].map(
          async (c) =>
            await Client.create({
              marche: c.marche,
              commissione: c.commission,
              visibility: 1,
            })
        );
      }
      if (countSort == 0) {
        ["NRP", "Appel effectué", "Faux Num", "Eteint"].map(
          async (sort) => await Sort.create({ sortValue: sort, visibility: 1 })
        );
      }
      if (countStatut == 0) {
        [
          "INITIE",
          "A Rappeler",
          "Contestation",
          "EN COURS DE TRAITEMENT",
          "INJOIGNABLE",
          "JOIGNABLE",
        ].map(
          async (statut) =>
            await Status.create({ statusValue: statut, visibility: 1 })
        );
      }
      if (counttypeReg == 0) {
        ["Chèque", "Espèce", "Virement"].map(
          async (typeReg) =>
            await TypeReglement.create({ typeReg: typeReg, visibility: 1 })
        );
      }
      if (countmodeReg == 0) {
        ["Terrain"].map(
          async (modeReg) =>
            await ModelReglement.create({ modeReg: modeReg, visibility: 1 })
        );
      }
      if (countAction == 0 && countFamilleAction == 0) {
        const items = [
          { famille: "Cadrage", actions: ["Envoi échéancier"] },
          { famille: "Appel Téléphonique", actions: ["Appel tél 1","Appel Final"] },
          { famille: "Terrain", actions: ["Visite Domicile"] },
        ];
        for(const item of items) {
          const savedFamille = await FamilleAction.create({familleAction:item.famille, visibility: 1}) 
          for(const action of item.actions) {
            await ListeAction.create({nomAction:action, visibility:1, familleId: savedFamille.id})
          }
        }
      }
      if(adminExists == 0) {
        await Admin.create({email:"admin@gmail.com",username:"PRC ADMIN", password:"PRC20202025"})
      }
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const { dict } = require("./controller/importCadrageController");
const { notifCount } = require("./controller/importCadrageController");
const {
  punchStatistics,
} = require("./controller/pilotageCommissionController.js");

app.get("/readNotif/:id", (req, res) => {
  const userId = Number(req.params.id);

  if (dict.has(userId)) {
    const userNotifs = dict.get(userId);

    // Mark all notifications as read
    for (const notif of userNotifs) {
      notif.isRead = true;
    }

    io.emit("Notification", { userId, notifs: userNotifs });
    return res.sendStatus(201); // 201 Created, no content
  } else {
    return res.status(404).json({ message: "Not Found" });
  }
});

function recalculateNotificationCounts() {
  const allTitles = [
    "Cadrage Banque",
    "Cadrage Patrimoine",
    "Cadrage Téléphonique",
    "Cadrage CNSS",
    "Cadrage Adresse",
  ];

  for (const [userId, notifs] of dict.entries()) {
    const byDossier = {};

    // Only count unread notifications
    const unreadNotifs = notifs.filter((notif) => !notif.isRead);

    for (const notif of unreadNotifs) {
      const dId = notif.dossierId;
      const title = notif.title;

      if (!byDossier[dId]) {
        byDossier[dId] = {};
        allTitles.forEach((t) => (byDossier[dId][t] = 0));
      }

      byDossier[dId][title] = (byDossier[dId][title] || 0) + 1;
    }

    notifCount.set(userId, byDossier);
  }
}

// Updated readCountNotif endpoint:
app.post("/readCountNotif", (req, res) => {
  const { userId, dossierId, cadrage } = req.body;

  try {
    // Mark corresponding notifications as read in the dict
    if (dict.has(userId)) {
      const userNotifications = dict.get(userId);

      // Find and mark notifications as read that match the dossierId and cadrage type
      for (const notif of userNotifications) {
        if (notif.dossierId === dossierId && notif.title === cadrage) {
          notif.isRead = true;
        }
      }

      // Recalculate the counts based on unread notifications only
      recalculateNotificationCounts();

      // Emit updated notifications
      io.emit("Notification", { userId, notifs: userNotifications });
    }

    // Emit updated count
    io.emit("NotifCount", {
      userId: userId,
      count: notifCount.get(userId) || {},
    });

    console.log("Updated notifCount:", notifCount.get(userId));
    return res.sendStatus(201);
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ message: "Not Found" });
  }
});

/////////////////////////////////////////// WEBSOCKETS ///////////////////////////////////////////////

io.on("connect", (socket) => {
  console.log("A user connected:", socket.id);

  // DOSSIERS
  socket.on("getDossierAgenda", async ({ id, role }) => {
    try {
      const dossiers = await fetchDossiersAgenda(id, role);
      socket.emit("dossiersAgendaData", { dossiers, id, role });
      setNewData(false);
      start = false;
    } catch (err) {
      socket.emit("dossiersAgendaError", err.message);
    }
  });

  // NOTIFICATIONS
  socket.on("Notif", async (userId) => {
    try {
      socket.emit("Notification", { userId: userId, notifs: dict.get(userId) });
    } catch (err) {
      socket.emit("NotifictaionError", err.message);
    }
  });

  // NOTIFICATIONS COUNT
  socket.on("NotifCount", async (userId) => {
    try {
      socket.emit("NotifCount", {
        userId: userId,
        count: notifCount.get(userId),
      });
    } catch (err) {
      socket.emit("NotifCountError", err.message);
    }
  });

  // PILOTAGE DE COMMISSION
  socket.on("plotage_commission", async () => {
    try {
      const plotage_commission = await punchStatistics();
      socket.emit("plotage_commission", plotage_commission);
    } catch (err) {
      socket.emit("plotage_commissionError", err.message);
    }
  });
});
