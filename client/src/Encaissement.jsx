import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaTrash, FaEdit, FaDownload } from "react-icons/fa";
import PopupEncaissement from "./PopupEncaissement";
// import { FaPlus, FaTrash, FaEdit, FaEye,  } from "react-icons/fa";

import axios from "axios";
import moment from "moment";

const Encaissement = ({ dossier }) => {
  const [encaissements, setEncaissements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [imageToView, setImageToView] = useState(null); // Pour la preview
  const [downloadingId, setDownloadingId] = useState(null);
  const [isPlusHovered, setIsPlusHovered] = useState(false);
      const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  const fecthEncaissement = async () => {
    try {
      const response = await axios.get(
        `http://${HOST}:${PORT}/encaissement/get/${dossier.dossier.id}`,
        {
          withCredentials: true,
        }
      );
      setEncaissements(response.data);
    } catch (error) {
      console.error("Error fetching encaissement:", error);
    }
  };

  const handleAddEncaissement = (newEncaissement) => {
    fecthEncaissement();
    setShowPopup(false);
  };

  useEffect(() => {
    fecthEncaissement();
  }, []);

  const handleDownload = async (piece) => {
    try {
      const response = await axios.get(
        `http://${HOST}:${PORT}/encaissement/download/${piece.id}`,
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
      const filename = piece.fileName || `encaissement_${piece.id}`;
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

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
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
          GESTION DES ENCAISSEMENTS
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
            width: "95%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            fontSize: "13px",
            color: "#333",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#bdbdbd",
                color: "black",
                textAlign: "left",
              }}
            >
              {[
                "N°",
                "Date règlement",
                "Type de règlement",
                "Mode de règlement",
                "Montant",
                "Responsable",
                "Fichier",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    padding: "10px 8px",
                    borderBottom: "2px solid #999",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {encaissements.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                  }}
                >
                  Aucun encaissement enregistré
                </td>
              </tr>
            ) : (
              encaissements.map((enc, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #ddd",
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1f8f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <td style={{ padding: "10px" }}>{enc.id}</td>
                  <td style={{ padding: "10px" }}>
                    {enc.dateReg
                      ? moment(enc.dateReg).format("DD/MM/YYYY")
                      : "-"}
                  </td>
                  <td style={{ padding: "10px" }}>{enc.typeReg || "-"}</td>
                  <td style={{ padding: "10px" }}>{enc.modeReg || "-"}</td>
                  <td style={{ padding: "10px" }}>
                    {enc.montant
                      ? `${parseFloat(enc.montant).toFixed(2)} MAD`
                      : "-"}
                  </td>
                  <td style={{ padding: "10px" }}>{enc.responsable || "-"}</td>
                  <td style={{ padding: "10px" }}>
                    {downloadingId === enc.id ? (
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
                        title={`Télécharger ${enc.fileName}`}
                        onClick={() => handleDownload(enc)}
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
          <PopupEncaissement
            onClose={() => setShowPopup(false)}
            onSave={handleAddEncaissement}
            dossier={dossier}
          />
        )}

        {imageToView && (
          <div
            onClick={() => setImageToView(null)}
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
              alt="Fichier"
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
    </div>
  );
};

export default Encaissement;
