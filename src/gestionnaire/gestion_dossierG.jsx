import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import Filtrage from "../Filtrage";
import GestionDossier from "../gestion_dossier";

export default function GestionDossierG() {
  const { gestionnaireNom } = useParams();
  const [debiteurFilter, setDebiteurFilter] = useState("");
  const [intervenantFilter, setIntervenantFilter] = useState("");
  const [dossierInterneFilter, setDossierInterneFilter] = useState("");
  const [dossierExterneFilter, setDossierExterneFilter] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [dossiers, setDossiers] = useState([]);
  const [gestionnaireName, setGestionnaireName] = useState("Gestionnaire");
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Charger les dossiers et le nom du gestionnaire
  useEffect(() => {
    const nameFromURL = decodeURIComponent(gestionnaireNom || "");
    const nameFromStorage = localStorage.getItem("selectedGestionnaireName");
    const nomGestionnaire = nameFromURL || nameFromStorage || "Gestionnaire";
    setGestionnaireName(nomGestionnaire);

    const fetchDossiers = async () => {
      try {
        const response = await fetch("http://localhost:3004/admin/dossiers");
        const responseData = await response.json();
        const data = Array.isArray(responseData) ? responseData : [responseData];

        const filtered = data.filter(
          (d) => (d.gestionnaire?.nom || "").toLowerCase() === nomGestionnaire.toLowerCase()
        );

        setDossiers(filtered);
        sessionStorage.setItem("dossiersManager", JSON.stringify(filtered));
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        const cached = sessionStorage.getItem("dossiersManager");
        if (cached) {
          try {
            setDossiers(JSON.parse(cached));
          } catch (e) {
            console.error("Erreur parsing sessionStorage :", e);
          }
        }
      }
    };

    fetchDossiers();
  }, [gestionnaireNom]);

  const filteredData = dossiers.filter((row) => {
    const search = globalSearch.toLowerCase();
    return (
      (row.client?.marche?.toLowerCase() || "").includes(search) ||
      (row.debiteurInfo?.debiteur?.nom?.toLowerCase() || "").includes(search) ||
      (row.debiteurInfo?.debiteur?.CIN?.toLowerCase() || "").includes(search)
    );
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dossiers");
    XLSX.writeFile(workbook, "dossiers_gestionnaire.xlsx");
  };

  const handleResetFilters = () => {
    setDebiteurFilter("");
    setIntervenantFilter("");
    setDossierInterneFilter("");
    setDossierExterneFilter("");
  };

  const thStyle = {
    padding: "0.5rem",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
    color: "#1e293b",
    fontWeight: 600,
    fontSize: "0.75rem",
  };

  const tdStyle = {
    padding: "0.5rem",
    textAlign: "center",
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
      <main style={{ flex: 1, padding: "1rem 2rem", overflow: "hidden" }}>
        {/* Recherche + export + titre */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#024a4f", marginLeft: "100px" }}>
            Dossiers de : {gestionnaireName}
          </h2>

          <button
            onClick={exportToExcel}
            style={{
              backgroundColor: "#024a4fff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Exporter Excel
          </button>
        </div>

        <div style={{ display: "flex", gap: "1rem", height: "90%" }}>
          <Filtrage
            debiteurFilter={debiteurFilter}
            setDebiteurFilter={setDebiteurFilter}
            intervenantFilter={intervenantFilter}
            setIntervenantFilter={setIntervenantFilter}
            dossierInterneFilter={dossierInterneFilter}
            setDossierInterneFilter={setDossierInterneFilter}
            dossierExterneFilter={dossierExterneFilter}
            setDossierExterneFilter={setDossierExterneFilter}
            handleResetFilters={handleResetFilters}
          />

          <section
            style={{
              width: "80%",
              height: "100%",
              overflowY: "auto",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }}>
              <thead
                style={{
                  backgroundColor: "#c7bbbbff",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <tr>
                  {["Client", "Intitulé débiteur", "N° pièce", "Solde (DH)", "Actions en cours"].map((text, i) => (
                    <th key={i} style={thStyle}>{text}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.75rem" }}>
                {filteredData.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: "#ddd7d794",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c7c1c1")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ddd7d794")}
                    onClick={() => {
                      setSelectedDossier(row);
                      setShowPopup(true);
                    }}
                  >
                    <td style={tdStyle}>{row.client.marche}</td>
                    <td style={tdStyle}>{row.debiteurInfo.debiteur.nom}</td>
                    <td style={tdStyle}>{row.debiteurInfo.debiteur.CIN}</td>
                    <td style={tdStyle}>{row.creance.creance}</td>
                    <td style={{ ...tdStyle, color: "#2563eb" }}>
                      {Array.isArray(row.actions) && row.actions.length > 0
                        ? row.actions[row.actions.length - 1].action
                        : "Aucune action"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>

      {/* ✅ Popup modal */}
      {showPopup && selectedDossier && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            width: "90%",
            height: "90%",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
            overflow: "auto",
          }}>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <GestionDossier
              client={selectedDossier.client}
              row={selectedDossier}
              onClose={() => setShowPopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
