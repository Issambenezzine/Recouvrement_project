import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filtrage from "../Filtrage";
import { FaInfoCircle } from "react-icons/fa";
import * as XLSX from "xlsx"; // ← pour l'export Excel
import axios from "axios";
import { useLocation } from "react-router-dom";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import moment from "moment";

export default function GestionDossier({ data }) {
  const navigate = useNavigate();

  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedGestionnaire, setSelectedGestionnaire] = useState("");
  const [dossiers, setDossiers] = useState([]);
  const [gestionnaires, setGestionnaires] = useState([]);

  const [debiteurFilter, setDebiteurFilter] = useState("");
  const [intervenantFilter, setIntervenantFilter] = useState("");
  const [dossierInterneFilter, setDossierInterneFilter] = useState("");
  const [dossierExterneFilter, setDossierExterneFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [familleFilter, setFamilleFilter] = useState("");
  const [showDossier, setShowDossier] = useState(false);
  const [clientFilter, setClientFilter] = useState();
  const [lotFilter, setLotFilter] = useState();
  const [statusFilter, setStatusFilter] = useState("");
  const [teleFilter, setTeleFilter] = useState("");
  // const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const location = useLocation();
  const { gestionnaireId } = location.state || "";
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  const verifyUser = async () => {
    try {
      console.log("verifyUser called of role :", localStorage.getItem("Role"));
      const res = await axios.get(`http://${HOST}:${PORT}/auth/responsable`, {
        withCredentials: true,
      });
    } catch (err) {
      navigate("/");
    }
  };

  const getGestionnaireByManager = async () => {
    try {
      const res = await axios.get(
        `http://${HOST}:${PORT}/gestionnaire/get/${localStorage.getItem(
          "UserId"
        )}`,
        {
          withCredentials: true,
        }
      );

      console.log("gestionnaires : ", res.data);
      setGestionnaires(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    console.log("USER ID : ", localStorage.getItem("UserId"));
    getGestionnaireByManager();
    const storedData = sessionStorage.getItem("dossiersManager");
    try {
      setDossiers(data);
      console.log("Parsed dossiers:", data);
    } catch (error) {
      console.error("Error parsing dossiersManager data:", error);
    }
  }, []);

  const filteredData = dossiers.filter((row) => {
    const search = globalSearch.toLowerCase();

    const debiteur = row.debiteurInfo?.debiteur || {};

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

    const externDossier =
      dossierExterneFilter.trim() === "" ||
      (row.dossier?.NDossier || "")
        .toLowerCase()
        .includes(dossierExterneFilter.toLowerCase());

    // Filter by selected gestionnaire
    const matchesGestionnaire =
      selectedGestionnaire === "" ||
      row.gestionnaireId === parseInt(selectedGestionnaire);
    const lastAction =
      Array.isArray(row.actions) && row.actions.length > 0
        ? row.actions[row.actions.length - 1]
        : null;

    const matchAction =
      actionFilter.trim() === "" ||
      (lastAction?.action || "")
        .toLowerCase()
        .includes(actionFilter.toLowerCase());

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
      matchesDebiteur &&
      matchClient &&
      matchesCIN &&
      matchesDossier &&
      matchLot &&
      matchStatus &&
      macthTel &&
      matchesGestionnaire &&
      matchAction &&
      matchFamille &&
      matchDateMin &&
      matchDateMax &&
      externDossier
    );
  });

  useEffect(() => {
    console.log("gestionnaireId from useLocation", gestionnaireId);
    if (gestionnaireId) {
      // only if a real ID exists
      setSelectedGestionnaire(gestionnaireId);
    }

    verifyUser();
  }, []);

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

  const handleResetFilters = () => {
    setDebiteurFilter("");
    setIntervenantFilter("");
    setDossierInterneFilter("");
    setDossierExterneFilter("");
    setLotFilter("");
    setClientFilter("");
    setFamilleFilter("");
    setTeleFilter("");
    setStatusFilter("");
    setMaxDate("");
    setMinDate("");
    setActionFilter("");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f3f4f6",
      }}
    >
      <main style={{ flex: 1, padding: "1rem 2rem", overflow: "hidden" }}>
        {/* Sélecteur de gestionnaire */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            position: "relative",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "20px" }}>
            {filteredData.length} Dossiers
          </div>
          {/* Dropdown centrée */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <select
              value={selectedGestionnaire}
              onChange={(e) => setSelectedGestionnaire(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "16px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                width: "250px",
              }}
            >
              <option value="">--Tous les gestionnaires--</option>
              {gestionnaires.map((g, index) => (
                <option key={index} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton Export à droite */}
          <div style={{ marginLeft: "auto" }}>
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
            actionFilter={actionFilter}
            setActionFilter={setActionFilter}
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
                    "Nombre de dossiers",
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
                  <tr key={index} style={{ backgroundColor: "#ddd7d794" }}>
                    <td style={tdStyle}>{row.client.marche}</td>
                    <td style={tdStyle}>{row.debiteurInfo.debiteur.nom}</td>
                    <td style={tdStyle}>{row.debiteurInfo.debiteur.CIN}</td>
                    <td style={tdStyle}>{row.nombre_dossier}</td>
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
    </div>
  );
}
