import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import Filtrage from "../Filtrage";
import GestionDossier from "../gestion_dossier";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"

export default function GestionDossierG({ data }) {
  const { gestionnaireNom } = useParams();
  const [debiteurFilter, setDebiteurFilter] = useState("");
  const [intervenantFilter, setIntervenantFilter] = useState("");
  const [dossierInterneFilter, setDossierInterneFilter] = useState("");
  const [dossierExterneFilter, setDossierExterneFilter] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [username, setUsername] = useState({});
  const [gestionnaireName, setGestionnaireName] = useState("Gestionnaire");
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [lotFilter, setLotFilter] = useState();
  const [clientFilter, setClientFilter] = useState();
  const [familleFilter, setFamilleFilter] = useState("");
  const [teleFilter, setTeleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDossier, setShowDossier] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;

  useEffect(() => {
    const nameFromURL = decodeURIComponent(gestionnaireNom || "");
    const nameFromStorage = localStorage.getItem("selectedGestionnaireName");
    const nomGestionnaire = nameFromURL || nameFromStorage || "Gestionnaire";
    setGestionnaireName(nomGestionnaire);


    const fetchUsername = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/gestionnaire/getUsername/${gestionnaireNom}`
        );
        setUsername(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchUsername();
  }, [gestionnaireNom]);

  const getFilteredData = () => {
    return data.filter((row) => row.gestionnaireId === Number(gestionnaireNom));
  };
  const filteredData = getFilteredData().filter((row) => {
    // debiteurInfo.debiteur is not an array, so we can directly check its properties
    const debiteur = row.debiteurInfo?.debiteur || {};

    // Filter conditions
    const matchesDebiteur =
      debiteurFilter.trim() === "" ||
      (debiteur.nom || "").toLowerCase().includes(debiteurFilter.toLowerCase());
    const matchesCIN =
      intervenantFilter.trim() === "" ||
      (debiteur.CIN || "")
        .toLowerCase()
        .includes(intervenantFilter.toLowerCase());
    const matchesDossier =
      !dossierInterneFilter || row.dossier?.id === Number(dossierInterneFilter);
    const matchLot = !lotFilter || row.dossier?.lotId === Number(lotFilter);
    const matchStatus =
      statusFilter.trim() === "" ||
      (row.dossier?.status || "")
        .toLowerCase()
        .includes(statusFilter.toLowerCase());
    const externDossier =
      dossierExterneFilter.trim() === "" ||
      (row.dossier?.NDossier || "")
        .toLowerCase()
        .includes(dossierExterneFilter.toLowerCase());
    const matchClient =
      !clientFilter || row.client?.id === Number(clientFilter);
    const macthTel =
      teleFilter.trim() === "" ||
      (row.debiteurInfo.debiteur.debiteur_tel1 || "")
        .toLowerCase()
        .includes(teleFilter.toLowerCase()) ||
      (row.debiteurInfo.debiteur.debiteur_tel2 || "")
        .toLowerCase()
        .includes(teleFilter.toLowerCase());
    // const matchFamille = familleFilter.trim() === '' || (row.action[row.action?.length - 1]?.familleAction || '').toLowerCase().includes(familleFilter.toLowerCase())
    // Add other filters as needed (like intervenantFilter)
    // const matchesIntervenant = intervenantFilter.trim() === '' || (row.intervenant || '').toLowerCase().includes(intervenantFilter.toLowerCase());
    const lastAction =
      Array.isArray(row.actions) && row.actions.length > 0
        ? row.actions[row.actions.length - 1]
        : null;

    const matchFamille =
      familleFilter.trim() === "" ||
      (lastAction?.familleAction || "")
        .toLowerCase()
        .includes(familleFilter.toLowerCase());

    const matchDateMin =
      minDate.trim() === "" ||
      (row.dossier.date_prevu &&
        new Date(row.dossier.date_prevu) >= new Date(minDate));

    const matchDateMax =
      maxDate.trim() === "" ||
      (row.dossier.date_prevu &&
        new Date(row.dossier.date_prevu) <= new Date(maxDate));

    return (
      matchFamille &&
      matchesDebiteur &&
      matchClient &&
      matchesCIN &&
      matchesDossier &&
      matchLot &&
      matchStatus &&
      macthTel &&
      externDossier &&
      matchDateMin &&
      matchDateMax
    );
  });

  const exportToExcel = () => {
        const exportData = [];
        filteredData.forEach((row) => {
            exportData.push({
              "Id Interne": row.dossier.id,
              "Id externe": row.dossier.NDossier || "",
              Catégorie: row.dossier.categorie || "",
              Marché: row.client.marche || "",
              Créance: row.creance.creance || "",
              Solde: row.creance.solde,
              "Mensualité": row.creance.mensualite,
              duree: row.creance.duree,
              encaissement: row.dossier.encaisse,
              statut:row.dossier.status,
              "Date prévu": row.dossier.date_prevu,
              "Date Première Échéance": moment(row.creance.date1Echeance).format("DD/MM/YYYY"),
              "Date Dernière Échéance": moment(row.creance.dateDEcheance).format("DD/MM/YYYY"),
              "Date Contentieux": moment(row.creance.dateContentieux).format("DD/MM/YYYY"),
              "Débiteur CIN" : row.debiteurInfo.debiteur.CIN,
              "Débiteur" : row.debiteurInfo.debiteur.nom,
              "Débiteur Date Naissance" : moment(row.debiteurInfo.debiteur.date_naissance).format("DD/MM/YYYY"),
              "Débiteur Profession" : row.debiteurInfo.debiteur.profession,
              "Débiteur Adresse" : row.debiteurInfo.addresses[0]?.addresseDebiteur,
              "Débiteur Ville" : row.debiteurInfo.addresses[0]?.ville,
              "Débiteur tel1" : row.debiteurInfo.debiteur.debiteur_tel1,
              "Débiteur tel2" : row.debiteurInfo.debiteur.debiteur_tel2,
              Gestionnaire: row.gestionnaire || "",
              Manager : row.manager || "",
              "nombre de dossiers" : row.nombre_dossier,
              "Commentaire Gestionnaire" : row.dossier.commentaire,
              "Commentaire Manager" : row.dossier.commentaire_responsable,
              "Cadrage" : row.dossier.cadrage
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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      <main style={{ flex: 1, padding: "1rem 2rem", overflow: "hidden" }}>
        {/* Recherche + export + titre */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "#024a4f",
              marginLeft: "100px",
            }}
          >
            Dossiers de : {username.username}
          </h2>

          <button
            onClick={(e) => exportToExcel()}
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
            lotFilter={lotFilter}
            setLotFilter={setLotFilter}
            setDebiteurFilter={setDebiteurFilter}
            intervenantFilter={intervenantFilter}
            setIntervenantFilter={setIntervenantFilter}
            dossierInterneFilter={dossierInterneFilter}
            setDossierInterneFilter={setDossierInterneFilter}
            dossierExterneFilter={dossierExterneFilter}
            setDossierExterneFilter={setDossierExterneFilter}
            handleResetFilters={handleResetFilters}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            teleFilter={teleFilter}
            setTeleFilter={setTeleFilter}
            familleFilter={familleFilter}
            setFamilleFilter={setFamilleFilter}
            minDate={minDate}
            setMinDate={setMinDate}
            maxDate={maxDate}
            setMaxDate={setMaxDate}
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
            <table
              style={{
                width: "100%",
                minWidth: "900px",
                borderCollapse: "collapse",
              }}
            >
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
                  {[
                    "Client",
                    "Intitulé débiteur",
                    "N° pièce",
                    "Solde (DH)",
                    "Actions en cours",
                  ].map((text, i) => (
                    <th key={i} style={thStyle}>
                      {text}
                    </th>
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
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c7c1c1")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ddd7d794")
                    }
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
        <GestionDossier
          client={selectedDossier}
          //   row={selectedDossier}
          onClose={() => setShowPopup(false)}
          dossiers={data}
        />
      )}
    </div>
  );
}
