import React, { useState, useMemo, useEffect} from "react";
import { FaSync, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import GestionDossier from "./gestion_dossier";
import axios from "axios";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import moment from "moment";
// filtres initiaux
const initialFilters = {
  dossierInterne: "",
  dossierExterne: "",
  client: null,
  debiteur: "",
  debiteurCIN: "",
  minMontant: null,
  maxMontant: null,
  dateFrom: "",
  dateTo: "",
  typeReglement: "",
  modeReglement: "",
};

export default function G_débiteurs({ dossiers }) {
  const [data, setData] = useState(dossiers);
  const [filters, setFilters] = useState(initialFilters);
  const [showDossier, setShowDossier] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [clients, setClients] = useState([]);
  const [modeReglementValues, setModeReglementValues] = useState([]);
  const [typeReglementValues, setTypeReglementValues] = useState([]);
  
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/parametrage/clients`
        );
        setClients(res.data.filter((stat) => stat.visibility === 1));
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchTypeReglement = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/parametrage/typereg`
        );
        setTypeReglementValues(res.data.filter((stat) => stat.visibility === 1));
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchModeReglement = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/parametrage/modereg`
        );
        setModeReglementValues(res.data.filter((stat) => stat.visibility === 1));
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchClient();
    fetchModeReglement();
    fetchTypeReglement();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleClick = (d) => {
    setShowDossier(true);
    setSelectedDossier(d);
  };

  const handleRefresh = () => {
    setData(dossiers);
    setFilters(initialFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Combined filtering and grouping logic
  const filteredAndGroupedData = useMemo(() => {
    // First, apply all filters to get matching dossiers
    const filtered = dossiers.filter((row) => {
      const debiteur = row.debiteurInfo?.debiteur || {};

      // Filter conditions
      const matchesDebiteur =
        filters.debiteur.trim() === "" ||
        (debiteur.nom || "").toLowerCase().includes(filters.debiteur.toLowerCase());
      
      const matchesCIN =
        filters.debiteurCIN.trim() === "" ||
        (debiteur.CIN || "").toLowerCase().includes(filters.debiteurCIN.toLowerCase());
      
      const matchesDossierInterne =
        filters.dossierInterne.trim() === "" ||
        (row.dossier?.id?.toString() || "").includes(filters.dossierInterne);
      
      const matchesDossierExterne =
        filters.dossierExterne.trim() === "" ||
        (row.dossier?.NDossier || "").toLowerCase().includes(filters.dossierExterne.toLowerCase());
      
      const matchClient =
        !filters.client || row.client?.id === Number(filters.client);
      
      const matchMinMontant =
        !filters.minMontant ||
        parseFloat(row.creance?.creance || 0) >= parseFloat(filters.minMontant);
      
      const matchMaxMontant =
        !filters.maxMontant ||
        parseFloat(row.creance?.creance || 0) <= parseFloat(filters.maxMontant);
      
      const matchDateFrom =
        filters.dateFrom.trim() === "" ||
        (row.dossier?.date_prevu &&
          new Date(row.dossier.date_prevu) >= new Date(filters.dateFrom));

      const matchDateTo =
        filters.dateTo.trim() === "" ||
        (row.dossier?.date_prevu &&
          new Date(row.dossier.date_prevu) <= new Date(filters.dateTo));

      const matchTypeReglement =
        filters.typeReglement.trim() === "" ||
        (row.encaissement.some((enc) => enc.typeReg === filters.typeReglement))

      const matchModeReglement =
        filters.modeReglement.trim() === "" ||
        (row.encaissement.some((enc) => enc.modeReg === filters.modeReglement));

      return (
        matchesDebiteur &&
        matchesCIN &&
        matchClient &&
        matchesDossierInterne &&
        matchesDossierExterne &&
        matchMinMontant &&
        matchMaxMontant &&
        matchDateFrom &&
        matchDateTo &&
        matchTypeReglement &&
        matchModeReglement
      );
    });

    // Then, group by debtor and keep only the dossier with highest creance
    const debiteurMap = {};
    filtered.forEach((dossier) => {
      const debiteurKey = dossier.debiteurInfo?.debiteur?.nom || 'unknown';
      const currentCreance = parseFloat(dossier.creance?.creance || 0);
      
      if (!debiteurMap[debiteurKey] || 
          currentCreance > parseFloat(debiteurMap[debiteurKey].creance?.creance || 0)) {
        debiteurMap[debiteurKey] = dossier;
      }
    });

    return Object.values(debiteurMap);
  }, [dossiers, filters]);

 const exportToExcel = () => {
     const exportData = [];
     filteredAndGroupedData.forEach((row) => {
       exportData.push({
         "Id Interne": row.dossier.id,
         "Id externe": row.dossier.NDossier || "",
         Catégorie: row.dossier.categorie || "",
         Marché: row.client.marche || "",
         Créance: row.creance.creance || "",
         Solde: row.creance.solde,
         Mensualité: row.creance.mensualite,
         duree: row.creance.duree,
         encaissement: row.dossier.encaisse,
         statut: row.dossier.status,
         "Date prévu": row.dossier.date_prevu,
         "Date Première Échéance": moment(row.creance.date1Echeance).format(
           "DD/MM/YYYY"
         ),
         "Date Dernière Échéance": moment(row.creance.dateDEcheance).format(
           "DD/MM/YYYY"
         ),
         "Date Contentieux": moment(row.creance.dateContentieux).format(
           "DD/MM/YYYY"
         ),
         "Débiteur CIN": row.debiteurInfo.debiteur.CIN,
         Débiteur: row.debiteurInfo.debiteur.nom,
         "Débiteur Date Naissance": moment(row.debiteurInfo.debiteur.date_naissance).format("DD/MM/YYYY"),
         "Débiteur Profession": row.debiteurInfo.debiteur.profession,
         "Débiteur Adresse": row.debiteurInfo.addresses[0]?.addresseDebiteur,
         "Débiteur Ville": row.debiteurInfo.addresses[0]?.ville,
         "Débiteur tel1": row.debiteurInfo.debiteur.debiteur_tel1,
         "Débiteur tel2": row.debiteurInfo.debiteur.debiteur_tel2,
         Gestionnaire: row.gestionnaire || "",
         Manager: row.manager || "",
         "nombre de dossiers": row.nombre_dossier,
         "Commentaire Gestionnaire": row.dossier.commentaire,
         "Commentaire Manager": row.dossier.commentaire_responsable,
         Cadrage: row.dossier.cadrage,
       });
     });
 
     // 1️⃣ Convert JSON to worksheet
     const worksheet = XLSX.utils.json_to_sheet(exportData);
 
     // 2️⃣ Create a workbook and append the worksheet
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, "Dossiers");
 
     // 3️⃣ Export the workbook to a file
     XLSX.writeFile(workbook, "Dossiers.xlsx");
     // Simuler l'export Excel (vous pouvez utiliser XLSX si disponible)
   };

  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: "1rem",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e0e0e0",
  };

  const titleStyle = {
    margin: 0,
    flex: 1,
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    marginLeft: "0.5rem",
    background: "#05514f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  };

  const contentStyle = {
    display: "flex",
    flex: 1,
    gap: "1.5rem",
    overflow: "hidden",
  };

  const sidebarStyle = {
    width: "280px",
    minWidth: "280px",
    padding: "1.5rem",
    background: "#f8f9fa",
    borderRadius: "8px",
    boxSizing: "border-box",
    border: "1px solid #e9ecef",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "0.9rem",
    boxSizing: "border-box",
  };

  const selectStyle = {
    ...inputStyle,
    width: "100%",
  };

  const tableContainerStyle = {
    flex: 1,
    overflow: "auto",
    background: "#fff",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.875rem",
  };

  const thStyle = {
    padding: "1rem 0.75rem",
    borderBottom: "2px solid #dee2e6",
    backgroundColor: "#c4b6b8",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "0.8rem",
    color: "#333",
    position: "sticky",
    top: 0,
    zIndex: 10,
  };

  const tdStyle = {
    padding: "0.875rem 0.75rem",
    borderBottom: "1px solid #e9ecef",
    textAlign: "center",
    fontSize: "0.8rem",
    color: "#555",
  };

  const summaryStyle = {
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #e9ecef",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>Liste des débiteurs</h2>
        <button
          onClick={handleRefresh}
          style={{
            ...buttonStyle,
            background: "#6c757d",
            marginRight: "0.5rem",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#5a6268"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#6c757d"}
        >
          <FaSync /> Actualiser
        </button>
        <button
          onClick={exportToExcel}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = "#044240"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#05514f"}
        >
          <FaFileExcel /> Excel
        </button>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {/* Sidebar - Filters */}
        <div style={sidebarStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#333" }}>Filtres</h3>
          
          <input
            type="text"
            name="dossierInterne"
            placeholder="Dossier interne"
            value={filters.dossierInterne}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <input
            type="text"
            name="dossierExterne"
            placeholder="Dossier externe"
            value={filters.dossierExterne}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <select
            name="client"
            value={filters.client || ""}
            onChange={handleFilterChange}
            style={selectStyle}
          >
            <option value="">Tous les clients</option>
            {clients.map((c, index) => (
              <option key={index} value={c.clientId}>{c.marche}</option>
            ))}
          </select>
          
          <input
            type="text"
            name="debiteur"
            placeholder="Débiteur"
            value={filters.debiteur}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <input
            type="text"
            name="debiteurCIN"
            placeholder="Numéro de pièce"
            value={filters.debiteurCIN}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <input
            type="number"
            name="minMontant"
            placeholder="Creance min"
            value={filters.minMontant || ""}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <input
            type="number"
            name="maxMontant"
            placeholder="Creance max"
            value={filters.maxMontant || ""}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            style={inputStyle}
          />
          
          <select
            name="typeReglement"
            value={filters.typeReglement}
            onChange={handleFilterChange}
            style={selectStyle}
          >
            <option value="">Type règlement</option>
            {typeReglementValues.map((m, index) => (
              <option key={index} value={m.typeReg}>{m.typeReg}</option>
            ))}
          </select>
          
          <select
            name="modeReglement"
            value={filters.modeReglement}
            onChange={handleFilterChange}
            style={selectStyle}
          >
            <option value="">Mode règlement</option>
            {modeReglementValues.map((m, index) => (
              <option key={index} value={m.modeReg}>{m.modeReg}</option>
            ))}
          </select>

          <button
            onClick={handleResetFilters}
            style={{
              ...buttonStyle,
              background: "#dc3545",
              width: "100%",
              marginTop: "1rem",
              justifyContent: "center",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
          >
            Réinitialiser les filtres
          </button>
        </div>

        {/* Main Content - Table */}
        <div style={tableContainerStyle}>
          <div style={summaryStyle}>
            Total des débiteurs: {filteredAndGroupedData.length}
          </div>
          
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Client</th>
                <th style={thStyle}>Intitulé débiteur</th>
                <th style={thStyle}>N° pièce</th>
                <th style={thStyle}># Dossier</th>
                <th style={thStyle}>Solde</th>
                <th style={thStyle}>Nb Dossiers</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndGroupedData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...tdStyle, padding: "2rem", fontStyle: "italic", color: "#999" }}>
                    Aucun débiteur trouvé avec les critères sélectionnés
                  </td>
                </tr>
              ) : (
                filteredAndGroupedData.map((dossier, i) => (
                  <tr
                    key={i}
                    style={{ cursor: "pointer", transition: "background-color 0.2s ease" }}
                    onClick={() => handleClick(dossier)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    <td style={tdStyle}>{dossier.client?.marche || '-'}</td>
                    <td style={tdStyle}>{dossier.debiteurInfo?.debiteur?.nom || '-'}</td>
                    <td style={tdStyle}>{dossier.debiteurInfo?.debiteur?.CIN || '-'}</td>
                    <td style={tdStyle}>{dossier.dossier?.id || '-'}</td>
                    <td style={tdStyle}>
                      {dossier.creance?.solde ? 
                        new Intl.NumberFormat('fr-MA', { 
                          style: 'currency', 
                          currency: 'MAD' 
                        }).format(parseFloat(dossier.creance.solde)) : '-'}
                    </td>
                    <td style={tdStyle}>{dossier.nombre_dossier || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showDossier && selectedDossier && (
        <GestionDossier
          client={selectedDossier}
          onClose={() => setShowDossier(false)}
          dossiers={dossiers}
          debiteur={true}
        />
      )}
    </div>
  );
}