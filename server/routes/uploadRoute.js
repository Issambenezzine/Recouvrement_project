// server/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Piece_jointe = require("../models/Piece_jointe");
const { authorize } = require("../middlewares/auth");
const fs = require("fs");

const router = express.Router();

var fileNameId = "";

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "Pieces_Jointes")); // Create this folder manually
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueId = Date.now(); // You can use uuid or any other unique value
    fileNameId = `${base}_${uniqueId}${ext}`;
    cb(null, `${base}_${uniqueId}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/piece", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { commentaire, dateAjout, dossierId, responsable } = req.body;

    console.log({
      commentaire,
      dateAjout,
      dossierId: Number(dossierId),
      responsable,
    });

    await Piece_jointe.create({
      responsable,
      commentaire,
      nomPiece: fileNameId,
      src_image: "routes/Pieces_Jointes/",
      dateAjout,
      dossierId: Number(dossierId),
    });

    res.json({ filename: req.file.filename });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
});

router.get("/download/:id", authorize, async (req, res) => {
  try {
    const pieceId = req.params.id;

    // Get the piece jointe from database using your Sequelize model
    const piece = await Piece_jointe.findByPk(pieceId);

    if (!piece) {
      return res.status(404).json({ error: "Pièce jointe non trouvée" });
    }

    // Construct the file path based on your storage structure
    // Your files are stored in "routes/Pieces_Jointes/" directory
    const filePath = path.join(__dirname, "Pieces_Jointes", piece.nomPiece);

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
      `attachment; filename="${piece.nomPiece}"`
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

// Alternative route if you want to download by filename directly
router.get("/download-file/:filename", authorize, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "Pieces_Jointes", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Fichier non trouvé" });
    }

    // Download the file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Erreur lors du téléchargement" });
        }
      }
    });
  } catch (error) {
    console.error("Error in download-file route:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
