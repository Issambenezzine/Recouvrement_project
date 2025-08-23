import React, { useEffect, useState, useRef } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import StatCards from "./Carde";
import GestionDossier from "./gestion_dossier";
import Filtrage from "./Filtrage";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import * as XLSX from "xlsx";
import moment from "moment"

// require("dotenv").config();

export default function Agenda({ data }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [debiteurFilter, setDebiteurFilter] = useState("");
  const [lotFilter, setLotFilter] = useState();
  const [clientFilter, setClientFilter] = useState();
  const [familleFilter, setFamilleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [teleFilter, setTeleFilter] = useState("");
  const [intervenantFilter, setIntervenantFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dossierInterneFilter, setDossierInterneFilter] = useState("");
  const [dossierExterneFilter, setDossierExterneFilter] = useState("");
  const [activeTable, setActiveTable] = useState("general");
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [dossiers, setDossier] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [usernames, setUsernames] = useState([]);
  // const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  const verifyUser = async () => {
    let url;
    switch (localStorage.getItem("Role")) {
      case "ADMIN":
        url = `http://${HOST}:${PORT}/auth/admin`;
        break;
      case "VISITEUR":
        url = `http://${HOST}:${PORT}/auth/visiteur`;
        break;
    }
    try {
      console.log("verifyUser called of role :", localStorage.getItem("Role"));
      const res = await axios.get(url, {
        withCredentials: true,
      });
    } catch (err) {
      navigate("/");
    }
  };

  const getUsernames = async () => {
    try {
      const res = await axios.get(
        `http://${HOST}:${PORT}/gestionnaire/getGestionnaireForAffect`,
        {
          withCredentials: true,
        }
      );
      setUsernames(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    verifyUser();
    getUsernames();
  }, []);

  const affecterDossier = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/dossier/affecter`,
        {
          ids: checkedRows,
          idGest: id,
        },
        { withCredentials: true }
      );

      toast.success(`${res.data.message}`, {
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

      setShowPopup(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (rowIndex) => {
    setCheckedRows((prev) => {
      if (prev.includes(rowIndex)) {
        return prev.filter((i) => i !== rowIndex); // Décocher
      } else {
        return [...prev, rowIndex]; // Cocher
      }
    });
  };
  const handleCheckAll = () => {
    if (checkAll) {
      setCheckedRows([]);
    } else {
      const allIndices = filteredData.map((row) => row.dossier.id);
      setCheckedRows(allIndices);
    }
    setCheckAll(!checkAll);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  // Ferme le popup si on clique à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFilteredData = () => {
    if (activeTable === "general") {
      return data;
    }
    if (activeTable === "Archive") {
      return data.filter(
        (item) => item.dossier && item.dossier.gestionnaireId === null
      );
    }
    if (activeTable === "Actions suite au cadrage") {
      return data.filter(
        (item) => item.dossier && item.dossier.cadrage === "OUI"
      );
    }
    return data.filter(
      (item) => item.dossier && item.dossier.etat === activeTable
    );
  };

  const handleCardClick = (tableType) => {
    setActiveTable(tableType);
  };

  const handleRowClick = (client) => {
    setSelectedClient(client);
    setShowDossier(true);
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
      matchDateMax &&
      matchAction
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
            borderTop: "4px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem",
          }}
        />
        <p style={{ margin: 0, color: "#2563eb", fontWeight: "bold" }}>
          Affectation en cours...
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f3f4f6",
      }}
    >
      {loading && <LoadingOverlay />}
      <main style={{ flex: 1, padding: "1rem 2rem", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <StatCards onCardClick={handleCardClick} dossiers={data} />
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <div style={{fontWeight:"bold", fontSize:"20px"}}>{filteredData.length} Dossiers</div>
            <BsFileEarmarkExcelFill onClick={(e) => exportToExcel()} style={{ color: "green" , fontSize:"20px", cursor:"pointer"}} />
          </div>
          <div style={{ display: "flex", gap: "1rem", flex: 1, minHeight: 0 }}>
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
              actionFilter={actionFilter}
              setActionFilter={setActionFilter}
            />
            
            

            <section
              style={{
                width: "80%",
                height: "100%",
                overflowY: "auto",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              }}
            >
              
              <div
                style={{
                  height: "100%",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    minWidth: "900px",
                    borderCollapse: "collapse",
                    backgroundColor: "#fff",
                  }}
                >
                  <thead
                    style={{
                      backgroundColor: "#f8fafc",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <tr>
                      {localStorage.getItem("Role") === "ADMIN" && (
                        <th style={thStyle}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checkAll}
                              onChange={handleCheckAll}
                            />
                            Option
                            <button
                              onClick={() =>
                                checkedRows.length > 0 && setShowPopup(true)
                              }
                              disabled={checkedRows.length === 0}
                              style={{
                                background: "none",
                                border: "none",
                                cursor:
                                  checkedRows.length === 0
                                    ? "not-allowed"
                                    : "pointer",
                                padding: "4px",
                                opacity: checkedRows.length === 0 ? 0.4 : 1,
                              }}
                              title={
                                checkedRows.length === 0
                                  ? "Sélectionnez d'abord au moins un dossier"
                                  : "Partager la sélection"
                              }
                            >
                              <FaExchangeAlt size={18} />
                            </button>
                          </div>
                        </th>
                      )}
                      {[
                        "Client",
                        "Intitulé débiteur",
                        "Numéro de pièce",
                        "Nombre de dossier",
                        "Solde",
                        "Gestionnaire",
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
                          backgroundColor:
                            index % 2 === 0 ? "#f1f5f9" : "#ffffff",
                          cursor: "pointer",
                        }}
                        onClick={() => handleRowClick(row)}
                      >
                        {localStorage.getItem("Role") === "ADMIN" && (
                          <td style={tdStyle}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={checkedRows.includes(row.dossier.id)}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  setIsMouseDown(true);
                                  handleCheckboxChange(row.dossier.id);
                                }}
                                onMouseOver={(e) => {
                                  if (isMouseDown)
                                    handleCheckboxChange(row.dossier.id);
                                }}
                                onMouseUp={() => setIsMouseDown(false)}
                                onChange={() => {}}
                              />
                            </div>
                          </td>
                        )}
                        <td style={tdStyle}>{row.client.marche}</td>
                        <td style={tdStyle}>{row.debiteurInfo.debiteur.nom}</td>
                        <td style={tdStyle}>{row.debiteurInfo.debiteur.CIN}</td>
                        <td style={tdStyle}>{row.nombre_dossier}</td>
                        <td style={tdStyle}>{row.creance.creance}</td>
                        <td style={tdStyle}>{row.gestionnaire || "---"}</td>
                        <td style={{ ...tdStyle, color: "#2563eb" }}>
                          {Array.isArray(row.actions) && row.actions.length > 0
                            ? row.actions[row.actions.length - 1].action
                            : "Aucune action"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showPopup && (
                  <div
                    onClick={() => setShowPopup(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 2000,
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: "#fff",
                        padding: "40px",
                        borderRadius: "12px",
                        width: "400px",
                        maxWidth: "90%",
                        textAlign: "center",
                        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                      }}
                    >
                      <h3 style={{ marginBottom: "20px" }}>
                        Sélectionner un gestionnaire
                      </h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {usernames.map((g, i) => (
                          <li
                            key={i}
                            style={{
                              padding: "10px",
                              margin: "6px 0",
                              backgroundColor: "#f8fafc",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                            onClick={() => affecterDossier(g.id)}
                          >
                            {g.username}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => setShowPopup(false)}
                        style={{
                          marginTop: "20px",
                          padding: "8px 20px",
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      {showDossier && selectedClient && (
        <GestionDossier
          client={selectedClient}
          onClose={() => setShowDossier(false)}
          dossiers={data}
        />
      )}
    </div>
  );
}
