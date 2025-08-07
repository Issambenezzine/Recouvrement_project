import React, { useEffect, useState, useRef } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import * as XLSX from "xlsx"; // ← Import XLSX pour l’export
import StatCards from "./Carde";
import GestionDossier from "./gestion_dossier";
import Filtrage from "./Filtrage";
import { useNavigate } from "react-router-dom";
// import {useSocketDossiersAgenda} from "./hooks/socketHook.js"
import { io } from "socket.io-client";
import axios from "axios";

// Aplatissement récursif d’un objet
const flattenObject = (obj, parent = "", res = {}) => {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const prop = parent ? `${parent}.${key}` : key;
    const val = obj[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      flattenObject(val, prop, res);
    } else {
      res[prop] = Array.isArray(val) ? JSON.stringify(val) : val;
    }
  }
  return res;
};

export default function Agenda() {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [debiteurFilter, setDebiteurFilter] = useState("");
  const [lotFilter, setLotFilter] = useState();
  const [clientFilter, setClientFilter] = useState();
  const [familleFilter, setFamilleFilter] = useState("");
  const [teleFilter, setTeleFilter] = useState("");
  const [intervenantFilter, setIntervenantFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dossierInterneFilter, setDossierInterneFilter] = useState("");
  const [dossierExterneFilter, setDossierExterneFilter] = useState("");
  const [activeTable, setActiveTable] = useState("general");
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDossier, setShowDossier] = useState(false);
  const [dossiers, setDossier] = useState([]);
  const [minDate,setMinDate] = useState("");
  const [maxDate,setMaxDate] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const verifyUser = async () => {
    try {
      console.log("verifyUser called of role :", localStorage.getItem("Role"));
      await axios.get('http://localhost:3004/auth/admin', {
        withCredentials: true,
      });
    } catch (err) {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const handleCheckboxChange = (rowIndex) => {
    setCheckedRows((prev) => {
      if (prev.includes(rowIndex)) {
        return prev.filter((i) => i !== rowIndex);
      } else {
        return [...prev, rowIndex];
      }
    });
  };
  const handleCheckAll = () => {
    if (checkAll) {
      setCheckedRows([]);
    } else {
      const allIndices = filteredData.map((_, idx) => idx);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:3004");
    const socket = socketRef.current;
    const handleConnect = () => {
      socket.emit("getDossierAgenda", {
        id: localStorage.getItem("UserId"),
        role: localStorage.getItem("Role"),
      });
    };

    const handleData = (dossiers) => {
      setData(JSON.parse(dossiers));
      localStorage.setItem("dossiersAdmin", dossiers);
    };

    const handleError = (errMsg) => {
      setError(errMsg);
    };

    socket.on("connect", handleConnect);
    socket.on("dossiersAgendaData", handleData);
    socket.on("dossiersAgendaError", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("dossiersAgendaData", handleData);
      socket.off("dossiersAgendaError", handleError);
    };
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
    return data.filter(
      (item) => item.dossier && item.dossier.etat === activeTable
    );
  };

  const filteredData = getFilteredData().filter((row) => {
    const debiteur = row.debiteurInfo?.debiteur || {};
    const lastAction =
      Array.isArray(row.actions) && row.actions.length > 0
        ? row.actions[row.actions.length - 1]
        : {};
    return (
      (!debiteurFilter ||
        debiteur.nom.toLowerCase().includes(debiteurFilter.toLowerCase())) &&
      (!intervenantFilter ||
        debiteur.CIN.toLowerCase().includes(intervenantFilter.toLowerCase())) &&
      (!dossierInterneFilter ||
        row.dossier?.id === Number(dossierInterneFilter)) &&
      (!lotFilter || row.dossier?.lotId === Number(lotFilter)) &&
      (!statusFilter ||
        row.dossier?.status
          .toLowerCase()
          .includes(statusFilter.toLowerCase())) &&
      (!dossierExterneFilter ||
        row.dossier?.NDossier
          .toLowerCase()
          .includes(dossierExterneFilter.toLowerCase())) &&
      (!clientFilter || row.client?.id === Number(clientFilter)) &&
      (!teleFilter ||
        debiteur.debiteur_tel1
          .toLowerCase()
          .includes(teleFilter.toLowerCase()) ||
        debiteur.debiteur_tel2
          .toLowerCase()
          .includes(teleFilter.toLowerCase())) &&
      (!familleFilter ||
        lastAction.familleAction
          .toLowerCase()
          .includes(familleFilter.toLowerCase())) &&
      (!minDate || new Date(row.dossier.date_prevu) >= new Date(minDate)) &&
      (!maxDate || new Date(row.dossier.date_prevu) <= new Date(maxDate))
    );
  });

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
    setMinDate("");
    setMaxDate("");
  };

  // Fonction d’export Excel dans le composant
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // 1) feuille "Dossiers"
    const sheet1 = filteredData.map((row) => ({
      Client: row.client?.marche || "",
      Débiteur: row.debiteurInfo?.debiteur?.nom || "",
      CIN: row.debiteurInfo?.debiteur?.CIN || "",
      "N° Dossier": row.dossier?.NDossier || "",
      Solde: row.creance?.creance || 0,
      Gestionnaire: row.gestionnaire || "---",
      "Dernière action":
        Array.isArray(row.actions) && row.actions.length
          ? row.actions.slice(-1)[0].action
          : "Aucune action",
    }));
    const ws1 = XLSX.utils.json_to_sheet(sheet1);
    XLSX.utils.book_append_sheet(wb, ws1, "Dossiers");

    // 2) feuille "Détail Dossier"
    const sheet2Data = filteredData.map((row) => flattenObject(row));
    const ws2 = XLSX.utils.json_to_sheet(sheet2Data);
    XLSX.utils.book_append_sheet(wb, ws2, "Détail Dossier");

    XLSX.writeFile(wb, `export_dossiers_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const thStyle = {
    padding: "0.5rem",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
    color: "#450101ff",
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
        backgroundColor: "#ffffffff",
        marginTop: "-20px",
      }}
    >
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

          <div style={{ display: "flex", justifyContent: "flex-end", margin: "0.5rem 0", marginTop: "0rem" }}>
            <button
              onClick={handleExport}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#014943ff",
                color: "#fff",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#014943ff")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#014943ff")}
            >
              <span> Excel</span>
             
            </button>
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
                            color="#4d0101ff"
                          />
                          Option
                          <button
                            onClick={() => checkedRows.length > 0 && setShowPopup(true)}
                            disabled={checkedRows.length === 0}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: checkedRows.length === 0 ? "not-allowed" : "pointer",
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
                      {[
                        "Client",
                        "Intitulé débiteur",
                        "Numéro de pièce",
                        "Nombre de dossier",
                        "Solde",
                        "Gestionnaire",
                        "Actions en cours",
                      ].map((text, i) => (
                        <th key={i} style={thStyle}>{text}</th>
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
                        <td style={tdStyle}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
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
                                if (isMouseDown) handleCheckboxChange(row.dossier.id);
                              }}
                              onMouseUp={() => setIsMouseDown(false)}
                              onChange={() => {}}
                            />
                          </div>
                        </td>
                        <td style={tdStyle}>{row.client.marche}</td>
                        <td style={tdStyle}>{row.debiteurInfo.debiteur.nom}</td>
                        <td style={tdStyle}>{row.debiteurInfo.debiteur.CIN}</td>
                        <td style={tdStyle}>{row.nombre_dossier}</td>
                        <td style={tdStyle}>{row.creance.creance}</td>
                        <td style={tdStyle}>{row.gestionnaire || "---"}</td>
                        <td style={{ ...tdStyle, color: "#5f0202ff" }}>
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
                      <h3 style={{ marginBottom: "20px" }}>Sélectionner un gestionnaire</h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {["Imane", "Aya", "Saad", "Omar"].map((g, i) => (
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
                            onClick={() => setShowPopup(false)}
                          >
                            {g}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => setShowPopup(false)}
                        style={{
                          marginTop: "20px",
                          padding: "8px 20px",
                          backgroundColor: "#4d0101ff",
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
