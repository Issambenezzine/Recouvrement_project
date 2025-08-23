import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import PopupAction from "./PopupAction";
import axios from "axios";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";

const Action = ({ actions, onAddActionn, dossier }) => {
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [isPlusHovered, setIsPlusHovered] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [action, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  const fetchActions = async () => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/action/get`,
        { dossierId: dossier.dossier.id },
        {
          withCredentials: true,
        }
      );
      setActions(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleAdd = async (newAction) => {
    newAction.dossierId = dossier.dossier.id;
    setIsLoading(true); // Start loading

    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/action/save`,
        {
          newAction,
          idManager: dossier.dossier.responsableId,
          idGest: dossier.dossier.gestionnaireId,
        },
        {
          withCredentials: true,
        }
      );

      // Success - show toast
      toast.success(`Une action a été ajouté !`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });

      await fetchActions(); // Refresh the actions list
      setShowActionPopup(false); // Close the popup
    } catch (err) {
      // Error handling - show error toast
      toast.error(`Erreur lors de l'ajout de l'action`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
      console.error(err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // Loading overlay component
  const LoadingOverlay = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #004d40",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem",
          }}
        />
        <p style={{ margin: 0, color: "#004d40", fontWeight: "bold" }}>
          Enregistrement en cours...
        </p>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {isLoading && <LoadingOverlay />}

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
          GESTION DES ACTIONS
          {localStorage.getItem("Role") !== "VISITEUR" && (
            <FaPlus
              style={{
                cursor: "pointer",
                color: isPlusHovered ? "green" : "#7d0022",
                fontSize: "25px",
              }}
              onClick={() => setShowActionPopup(true)}
              onMouseEnter={() => setIsPlusHovered(true)}
              onMouseLeave={() => setIsPlusHovered(false)}
              title="Ajouter une action"
            />
          )}
        </h3>

        <table
          style={{
            width: "95%",
            borderCollapse: "collapse",
            marginTop: "0.8rem",
            fontSize: "13px",
            color: "#333",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            tableLayout: "fixed",
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
                "Famille d'action",
                "Action",
                "Date exécution",
                "Sort",
                "Action suivante",
                "Date action suivante",
                "Nouveau statut",
                "Commentaires",
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
            {actions.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  style={{
                    textAlign: "center",
                    padding: "16px",
                    color: "#666",
                    fontSize: "12.5px",
                  }}
                >
                  Aucune action enregistrée
                </td>
              </tr>
            ) : (
              action.map((action, index) => (
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
                  <td style={{ padding: "8px" }}>{action.id}</td>
                  <td style={{ padding: "8px" }}>
                    {action.familleAction || "-"}
                  </td>
                  <td style={{ padding: "8px" }}>{action.action || "-"}</td>
                  <td style={{ padding: "8px" }}>
                    {action.dateExecution || "-"}
                  </td>
                  <td style={{ padding: "8px" }}>{action.sort || "-"}</td>
                  <td style={{ padding: "8px" }}>
                    {action.actionSuivante || "-"}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {action.dateActionSuivante || "-"}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {action.nouveauStatus || "-"}
                  </td>
                  <td
                    onClick={() => toggleExpand(index)}
                    title="Cliquez pour voir plus"
                    style={{
                      padding: "8px",
                      maxWidth: expandedIndex === index ? "300px" : "120px",
                      whiteSpace: expandedIndex === index ? "normal" : "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                      wordBreak: "break-word",
                      lineHeight: "1.4",
                      transition: "max-width 0.3s ease",
                      display: "inline-block",
                      verticalAlign: "top",
                    }}
                  >
                    {action.detail || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showActionPopup && (
          <PopupAction
            dossier={dossier}
            onClose={() => setShowActionPopup(false)}
            onSave={handleAdd}
          />
        )}
      </div>
    </div>
  );
};

export default Action;
