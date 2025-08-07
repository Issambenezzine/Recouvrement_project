import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Filtrage from "../Filtrage";
import { FaInfoCircle } from "react-icons/fa";
import * as XLSX from "xlsx";
import axios from "axios";

export default function GestionDossier() {
  const navigate = useNavigate();
  const location = useLocation();

  const [debiteurFilter, setDebiteurFilter] = useState("");
  const [intervenantFilter, setIntervenantFilter] = useState("");
  const [dossierInterneFilter, setDossierInterneFilter] = useState("");
  const [dossierExterneFilter, setDossierExterneFilter] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedGestionnaire, setSelectedGestionnaire] = useState("");
  const [dossiers, setDossiers] = useState([]);
  const [gestionnaires, setGestionnaires] = useState([]);

  const verifyUser = async () => {
    try {
      await axios.get(`http://localhost:3004/auth/responsable`, { withCredentials: true });
    } catch (err) {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const getGestionnaireByManager = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3004/gestionnaire/get/${localStorage.getItem("UserId")}`,
        { withCredentials: true }
      );
      setGestionnaires(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    getGestionnaireByManager();
    const storedData = sessionStorage.getItem("dossiersManager");
    try {
      const data = JSON.parse(storedData);
      setDossiers(data);

      // lecture depuis l'URL (ex: ?gestionnaire=Sarah)
      const params = new URLSearchParams(location.search);
      const gestionnaireNom = params.get("gestionnaire");
      if (gestionnaireNom) {
        setSelectedGestionnaire(gestionnaireNom);
      }
    } catch (error) {
      console.error("Error parsing dossiersManager data:", error);
    }
  }, [location.search]);

  const handleGestionnaireChange = (e) => {
    const nom = e.target.value;
    setSelectedGestionnaire(nom);
    navigate(`?gestionnaire=${encodeURIComponent(nom)}`);
  };

  const filteredData = dossiers.filter((row) => {
    const search = globalSearch.toLowerCase();
    const matchesGlobalSearch =
      row.client.marche.toLowerCase().includes(search) ||
      row.debiteurInfo.debiteur.nom.toLowerCase().includes(search) ||
      row.debiteurInfo.debiteur.CIN.toLowerCase().includes(search);

    const gestionnaireNom = gestionnaires.find(g => g.id === row.gestionnaireId)?.name || "";
    const matchesGestionnaire = selectedGestionnaire === "" || gestionnaireNom === selectedGestionnaire;

    return matchesGlobalSearch && matchesGestionnaire;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dossiers");
    XLSX.writeFile(workbook, "dossiers_recouvrement.xlsx");
  };

  const thStyle = {
    padding: "0.5rem",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
    color: "white",
    fontWeight: 600,
    fontSize: "0.75rem",
  };

  const tdStyle = {
    padding: "0.5rem",
    textAlign: "center",
  };

  const handleResetFilters = () => {
    setDebiteurFilter("");
    setIntervenantFilter("");
    setDossierInterneFilter("");
    setDossierExterneFilter("");
    setSelectedGestionnaire("");
    navigate("?");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffff", marginTop: "-7px" }}>
      <main style={{ flex: 1, padding: "1rem 2rem", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <select
              value={selectedGestionnaire}
              onChange={handleGestionnaireChange}
              style={{ padding: "0.5rem 1rem", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc", width: "250px" }}
            >
              <option value="">--Tous les gestionnaires--</option>
              {gestionnaires.map((g, index) => (
                <option key={index} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={exportToExcel}
              style={{ backgroundColor: "#024a4fff", color: "#fff", border: "none", borderRadius: "4px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "bold" }}
            >
              Exporter Excel
            </button>
          </div>
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

          <section style={{ width: "80%", height: "100%", overflowY: "auto", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff", borderRadius: "8px" }}>
            <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#6a4343ef", color: "#fff", position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  {["Client", "Intitulé débiteur", "N° pièce", "Nombre de dossiers", "Solde (DH)", "Actions en cours"].map((text, i) => (
                    <th key={i} style={thStyle}>{text}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.75rem" }}>
                {filteredData.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: "#ddd7d794" }}>
                    <td style={tdStyle}>{row.client.marche}</td>
                    <td style={tdStyle}>{row.debiteurInfo.debiteur.nom}</td>
                    <td style={tdStyle}>{row.debiteurInfo.debiteur.CIN}</td>
                    <td style={tdStyle}>{row.nombre_dossier}</td>
                    <td style={tdStyle}>{row.creance.creance}</td>
                    <td style={{ ...tdStyle, color: "#530202ff" }}>
                      {Array.isArray(row.actions) && row.actions.length > 0 ? row.actions[row.actions.length - 1].action : "Aucune action"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}
