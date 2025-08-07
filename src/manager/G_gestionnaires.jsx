import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const G_gestionnaires = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [states, setStates] = useState([]);
  const [objectifs, setObjectifs] = useState([]);  // ← tableau, pas objet

  useEffect(() => {
    const fetchGestionnairesStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3004/responsable/gestionnaire/stats/${localStorage.getItem(
            "UserId"
          )}`
        );
        setStates(res.data);
        // initialiser un objectif vide pour chaque gestionnaire (array)
        setObjectifs(res.data.map((g) => g.objectif || ""));
      } catch (err) {
        console.error("Error fetching gestionnaires:", err.message);
      }
    };
    fetchGestionnairesStats();
  }, []);

  const filteredGestionnaires = states.filter((g) =>
    g.gest.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDossier = (nom) => {
    navigate(`/manager/dossier?gestionnaire=${encodeURIComponent(nom)}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un gestionnaire..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "16px",
          padding: "8px 12px",
          width: "300px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowY: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "16px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#bd9f9fba",
                  color: "#333",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  textAlign: "center",
                }}
              >
                <th style={{ padding: "12px", textAlign: "left" }}>
                  NOM DU GESTIONNAIRE
                </th>
                <th style={{ padding: "12px" }}>NOMBRE DE DOSSIERS</th>
                <th style={{ padding: "12px" }}>NOMBRE D'ACTIONS</th>
                <th style={{ padding: "12px" }}>OBJECTIF</th>
                <th style={{ padding: "12px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredGestionnaires.map((gest, idx) => (
                <tr
                  key={gest.id}
                  style={{
                    textAlign: "center",
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: 500,
                    }}
                  >
                    {gest.gest}
                  </td>
                  <td style={{ padding: "12px" }}>{gest.nbr_dossier || 0}</td>
                  <td style={{ padding: "12px" }}>{gest.nbr_action || 0}</td>
                  <td style={{ padding: "8px" }}>
                    <input
                      type="text"
                      value={objectifs[idx] || ""}
                      onChange={(e) => {
                        const updated = [...objectifs];
                        updated[idx] = e.target.value;
                        setObjectifs(updated);
                      }}
                      placeholder="Définir un objectif..."
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <button
                      onClick={() => handleViewDossier(gest.gest)}
                      style={{
                        background: "none",
                        border: "1px solid #f7f8fbff",
                        color: "#510101ff",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        margin: "0 auto",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#510101ff";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#510101ff";
                      }}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredGestionnaires.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    {search
                      ? "Aucun gestionnaire ne correspond à votre recherche."
                      : "Aucun gestionnaire trouvé."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default G_gestionnaires;
