import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaEye, FaDownload } from "react-icons/fa";
import PopupPieceJointe from "./popupPieceJointe";
import axios from "axios";

const PieceJointe = ({ dossier }) => {
  const [pieces, setPieces] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [imageToView, setImageToView] = useState(null);
  const [isPlusHovered, setIsPlusHovered] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  const fetchPieces = async () => {
    try {
      const res = await axios.get(
        `http://${HOST}:${PORT}/piece_jointe/get/${dossier.dossier.id}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setPieces(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownload = async (piece) => {
    try {
      setDownloadingId(piece.id);

      const response = await axios.get(
        `http://${HOST}:${PORT}/upload/download/${piece.id}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      // Create blob link to download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Use the original filename from the piece
      const filename = piece.nomPiece || `piece_jointe_${piece.id}`;
      link.setAttribute("download", filename);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Erreur lors du téléchargement du fichier");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleAdd = () => {
    fetchPieces();
    setShowPopup(false);
  };

  useEffect(() => {
    fetchPieces();
  }, []);

  const handleCloseImage = () => setImageToView(null);

  return (
    <div style={{ width: "100%", fontFamily: "Segoe UI, sans-serif" }}>
      <div style={{ padding: "1rem" }}>
        <h3
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#004d40",
            fontSize: "18px",
          }}
        >
          GESTION DES PIÈCES JOINTES
          {localStorage.getItem("Role") !== "VISITEUR" && (
            <FaPlus
              style={{
                cursor: "pointer",
                color: isPlusHovered ? "green" : "#7d0022",
                fontSize: "25px",
              }}
              onClick={() => setShowPopup(true)}
              onMouseEnter={() => setIsPlusHovered(true)}
              onMouseLeave={() => setIsPlusHovered(false)}
              title="Ajouter une pièce jointe"
            />
          )}
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            fontSize: "13.5px",
            color: "#333",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#d3d3d3", color: "black" }}>
              {[
                "N°",
                "Nom de la pièce",
                "Commentaire",
                "Date d'ajout",
                "Responsable",
                "Télécharger",
              ].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "10px",
                    borderBottom: "2px solid #999",
                    textAlign: "left",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pieces.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#888",
                  }}
                >
                  Aucune pièce jointe enregistrée
                </td>
              </tr>
            ) : (
              pieces.map((piece, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #ddd",
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f8f8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <td style={{ padding: "10px" }}>{piece.id}</td>
                  <td style={{ padding: "10px" }}>{piece.nomPiece}</td>
                  <td style={{ padding: "10px" }}>{piece.commentaire}</td>
                  <td style={{ padding: "10px" }}>
                    {new Date(piece.dateAjout).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "10px" }}>{piece.responsable}</td>
                  <td style={{ padding: "10px" }}>
                    {downloadingId === piece.id ? (
                      <div
                        style={{
                          display: "inline-block",
                          width: "16px",
                          height: "16px",
                          border: "2px solid #f3f3f3",
                          borderTop: "2px solid #004d40",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    ) : (
                      <FaDownload
                        style={{
                          cursor: "pointer",
                          color: "#004d40",
                          fontSize: "16px",
                          transition: "color 0.3s, transform 0.2s",
                        }}
                        title={`Télécharger ${piece.nomPiece}`}
                        onClick={() => handleDownload(piece)}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#00695c";
                          e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#004d40";
                          e.target.style.transform = "scale(1)";
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showPopup && (
          <PopupPieceJointe
            onClose={() => setShowPopup(false)}
            onSave={handleAdd}
            dossier={dossier}
          />
        )}

        {imageToView && (
          <div
            onClick={handleCloseImage}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <img
              src={imageToView}
              alt="Pièce jointe"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "8px",
                boxShadow: "0 0 20px #000",
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PieceJointe;
