import React, { useState, useRef, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import CardeManager from "../manager/Carde_manager";
import Filtrage from "../Filtrage";
import PopupNewDebiteurs from "../manager/PopupNewDebiteurs";
import GestionDossier from "../gestion_dossier";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

export default function Agenda_manager() {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [debiteurFilter, setDebiteurFilter] = useState("");
  const [intervenantFilter, setIntervenantFilter] = useState("");
  const [dossierInterneFilter, setDossierInterneFilter] = useState("");
  const [dossierExterneFilter, setDossierExterneFilter] = useState("");
  const [activeTable, setActiveTable] = useState("general");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDossier, setShowDossier] = useState(false);
  const [familleFilter, setFamilleFilter] = useState("");
  const [clientFilter, setClientFilter] = useState();
  const [lotFilter, setLotFilter] = useState();
  const [statusFilter, setStatusFilter] = useState("");
  const [teleFilter, setTeleFilter] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [minDate,setMinDate] = useState("");
  const [maxDate,setMaxDate] = useState("")
  const [newDebiteurs, setNewDebiteurs] = useState([
    {
      client: "Bank Assafa",
      debiteur: "Omar El Youssfi",
      piece: "ZY123456",
      dossier: "10",
      solde: "7,000.00",
      gestionnaire: "E",
      action: "Nouvelle action",
      type: "aTraiter",
    },
    {
      client: "CIH",
      debiteur: "Youssef Alaoui",
      piece: "AA908890",
      dossier: "11",
      solde: "11,000.00",
      gestionnaire: "B",
      action: "Cadrage",
      type: "suiteCadrage",
    },
  ]);
  const verifyUser = async () => {
    try {
      console.log("verifyUser called of role :", localStorage.getItem("Role"));
      const res = await axios.get('http://localhost:3004/auth/responsable', {
        withCredentials: true,
      });
    } catch (err) {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:3004");
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
      socket.emit("getDossierAgenda", {
        id: localStorage.getItem("UserId"),
        role: localStorage.getItem("Role"),
      });
    });

    socket.on("dossiersAgendaData", (dossiers) => {
      const parsed = JSON.parse(dossiers);
      setData(parsed);
      sessionStorage.setItem("dossiersManager", dossiers);
    });

    socket.on("dossiersAgendaError", (errMsg) => {
      console.error("❌ Socket error:", errMsg);
      setError(errMsg);
    });

    return () => {
      socket.off("connect");
      socket.off("dossiersAgendaData");
      socket.off("dossiersAgendaError");
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
      (item) => item.dossier && item.dossier.etatResponsable === activeTable
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
    setLotFilter("")
    setClientFilter("")
    setFamilleFilter("")
    setTeleFilter("")
    setStatusFilter("");
    setMaxDate("")
    setMinDate("")

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
    const matchesDossier = !dossierInterneFilter || row.dossier?.id === Number(dossierInterneFilter);
    const matchLot = !lotFilter || row.dossier?.lotId === Number(lotFilter);
    const matchStatus =
      statusFilter.trim() === "" ||
      (row.dossier?.status || "")
        .toLowerCase()
        .includes(statusFilter.toLowerCase());
    const externDossier = dossierExterneFilter.trim() === "" ||
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

    const matchDateMin = minDate.trim() === "" ||
      (row.dossier.date_prevu && new Date(row.dossier.date_prevu) >= new Date(minDate));

    const matchDateMax = maxDate.trim() === "" ||
      (row.dossier.date_prevu && new Date(row.dossier.date_prevu) <= new Date(maxDate));


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

  const tdStyle2 = {
    padding:"0.3rem"
  }

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
            <CardeManager
              onCardClick={handleCardClick}
              dossiers={data}
              onNewClick={() => setShowNewPopup(true)}
            />
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
                       
                        <td style={tdStyle}>{row.client?.marche || ""}</td>
                        <td style={tdStyle}>
                          {row.debiteurInfo?.debiteur?.nom || ""}
                        </td>
                        <td style={tdStyle}>
                          {row.debiteurInfo?.debiteur?.CIN || ""}
                        </td>
                        <td style={tdStyle}>{row.nombre_dossier || ""}</td>
                        <td style={tdStyle}>{row.creance.capital || ""}</td>
                        <td style={tdStyle}>{row.gestionnaire || "---"}</td>
                        <td style={{ ...tdStyle, color: "#3f0101ff" }}>
                          {Array.isArray(row.actions) && row.actions.length > 0
                            ? row.actions[row.actions.length - 1].action
                            : "Aucune action"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>

      {showDossier && selectedClient && (
        <GestionDossier
          client={selectedClient}
          onClose={() => setShowDossier(false)}
          dossiers = {data}
        />
      )}

      {showNewPopup && (
        <PopupNewDebiteurs
          debiteurs={newDebiteurs}
          setDebiteurs={setNewDebiteurs}
          onClose={() => setShowNewPopup(false)}
          onValidate={handleValidateNewDebiteurs}
        />
      )}
    </div>
  );
}