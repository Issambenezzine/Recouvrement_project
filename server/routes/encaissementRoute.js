const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Encaissement = require("../models/Encaissement.js");
const { authorize } = require("../middlewares/auth.js");
const {
  addEncaissement,
  uploadPieceJointe,
  getEncaissement,
} = require("../controller/encaissementController.js");
const redisClient = require("../config/redis.js");
const Creance = require("../models/Creance.js");
const { literal } = require("sequelize");
const { fetchDossiersAgenda } = require("../controller/agendaController.js");
const { punchStatistics } = require("../controller/pilotageCommissionController.js");
const Dossier = require("../models/Dossier.js");

const redisKey = "2002_KAFKA"


router.post("/upload", authorize, uploadPieceJointe);

router.get("/get/:dossierId", authorize, getEncaissement);

var fileNameId = "";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "encaissements")); // Create this folder manually
  },
  filename: (req, file, cb) => {
    // Add a unique id (timestamp) at the end of the filename before extension
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueId = Date.now(); // You can use uuid or any other unique value
    fileNameId = `${base}_${uniqueId}${ext}`;
    cb(null, `${base}_${uniqueId}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/encaiss", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const {
      typeReg,
      dateReg,
      modeReg,
      montant,
      dossierId,
      responsable,
      creanceId,
      UserId,
    } = req.body;

    console.log({
      typeReg,
      dateReg,
      montant,
      modeReg,
      dossierId: Number(dossierId),
      responsable,
      creanceId,
      UserId,
    });

    const savedEncaissement = await Encaissement.create({
      responsable,
      typeReg,
      modeReg,
      montant,
      dateReg,
      dossierId: Number(dossierId),
      fileName: fileNameId,
    });

    
    const redisData = await redisClient.get(redisKey);
    const redisDataParsed = JSON.parse(redisData);
    const dossier = redisDataParsed.redisStructure.find(
      (d) => d.dossier.id == savedEncaissement.dossierId // use == to handle number/string mismatch
    );

    if (dossier) {
      // Add new property or push into array
      dossier.encaissement.push({
        id: savedEncaissement.id,
        responsable: savedEncaissement.responsable,
        typeReg: savedEncaissement.typeReg,
        modeReg: savedEncaissement.modeReg,
        montant: Number(savedEncaissement.montant),
        dateReg: savedEncaissement.dateReg,
        dossierId: savedEncaissement.dossierId,
        fileName: savedEncaissement.fileName,
      });
      dossier.dossier.encaisse += Number(savedEncaissement.montant);
      dossier.creance.solde -= Number(savedEncaissement.montant);
    }

    await redisClient.set(redisKey, JSON.stringify(redisDataParsed));

    await Creance.update(
      { solde: literal(`solde - ${montant}`) },
      { where: { id: creanceId } }
    );
    await Dossier.update(
      {encaisse: literal(`encaisse + ${montant}`) },
      { where: { id: dossierId } }
    )
    const io = req.app.get("io");
    let updatedDossiers = await fetchDossiersAgenda(UserId, "GESTIONNAIRE");
    io.emit("dossiersAgendaData", updatedDossiers);

    let statis = await punchStatistics()
    io.emit("plotage_commission", statis);

    res.status(201).json({ filename: req.file.filename });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
});

router.get("/download/:id", authorize, async (req, res) => {
  try {
    const encaissementId = req.params.id;

    // Get the piece jointe from database using your Sequelize model
    const encaissement = await Encaissement.findByPk(encaissementId);

    if (!encaissement) {
      return res.status(404).json({ error: "Encaissement non trouvée" });
    }

    // Construct the file path based on your storage structure
    // Your files are stored in "routes/Pieces_Jointes/" directory
    const filePath = path.join(
      __dirname,
      "encaissements",
      encaissement.fileName
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ error: "Fichier non trouvé sur le serveur" });
    }

    // Get file stats
    const stat = fs.statSync(filePath);

    // Set appropriate headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encaissement.fileName}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", stat.size);

    // Create read stream and pipe to response
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    // Handle stream errors
    readStream.on("error", (err) => {
      console.error("Error reading file:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Erreur lors de la lecture du fichier" });
      }
    });
  } catch (error) {
    console.error("Error in download route:", error);
    res.status(500).json({ error: "Erreur serveur lors du téléchargement" });
  }
});

module.exports = router;
