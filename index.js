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
const Admin = require("./models/Admin.js");
const Demande_Cadrage = require("./models/Demande_Cadrage.js");
const Gestionnaire = require("./models/Gestionnaire.js");
const Responsable = require("./models/Responsable.js");
const Action = require("./models/Action.js");
const Lot = require("./models/Lot.js");
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
const userRoute = require("./routes/UserRoute.js")

const cors = require("cors");
const {
  getGestionnairesId,
  fetchUsers,
} = require("./controller/gestionnaireController.js");

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
// Routes
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
app.use("/user",userRoute)

// Les relations

Debiteur.hasMany(Dossier, { foreignKey: "debiteurId", as: "dossiers" });
Dossier.belongsTo(Debiteur, { foreignKey: "debiteurId", as: "debiteur" });

Lot.hasMany(Dossier, { foreignKey: "lotId", as: "lot_dossiers" });
Dossier.belongsTo(Debiteur, { foreignKey: "lotId", as: "dossier_lot" });

Creance.hasOne(Dossier, { foreignKey: "creanceId", as: "dossier" });
Dossier.belongsTo(Creance, { foreignKey: "creanceId", as: "creance" });

Client.hasMany(Dossier, { foreignKey: "clientId", as: "dossiers" });
Dossier.belongsTo(Client, { foreignKey: "clientId", as: "client" });

Status.hasMany(Dossier, { foreignKey: "statusId", as: "dossiers" });
Dossier.belongsTo(Status, { foreignKey: "statusId", as: "status" });

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

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

connection
  .authenticate()
  .then(() => {
    console.log("Connection to MySQL has been established successfully.");
    return connection.sync({ alter: false }); // WARNING: This will drop existing tables and recreate them! Use with caution in production.
  })
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`Server running with WebSocket on http://${HOST}:${PORT}`);
      //saveAdmin("Omar","omar@gmail.com","admin1234")
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

io.on("connect", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("getProfiles", async () => {
    try {
      //const dossiers = await fetchDossiersAgenda();
      // const users = await fetchUsers();
      // socket.emit("profiles", users);
      //socket.emit("dossiersAgendaData", dossiers);
    } catch (err) {
      console.log(`Socket Error: ${err.message}`)
      //socket.emit("dossiersAgendaError", err.message);
      socket.emit("profilesError", err.message);
    }
  });
});
