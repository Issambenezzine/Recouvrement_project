import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaUniversity,
  FaUsers,
  FaMoneyBill,
  FaRegClock,
  FaFileAlt,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import logo from "./assets/prc_logo.png";
import PopupAction from "./PopupAction";
import Timeline from "./Timeline";
import Action from "./Action";
import Encaissement from "./Encaissement";
import Contentieux from "./Contentieux";
import PieceJointe from "./PieceJointe";
import Creance from "./Creance";
import Historique from "./Historique";
import Commentaire from "./Commentaire";
import DetailDossier from "./DetailDossier";
import { io } from "socket.io-client";
import Débiteur from "./debiteur/Débiteur";
import Employeur from "./debiteur/Employeur";
import Patrimoine from "./debiteur/Patrimoine";
import Banque from "./debiteur/Banque";
import Intervenant from "./debiteur/Intervenant";
import Retraite from "./debiteur/Retraite";
import Tresorerie from "./debiteur/Tresorerie";
import Adresse from "./debiteur/Adresse";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const iconMap = {
  detail: <FaFileAlt style={{ marginRight: "8px" }} />,
  débiteur: <FaUser style={{ marginRight: "8px" }} />,
  adresse: <FaLocationDot style={{ marginRight: "8px" }} />,
  employeur: <FaBriefcase style={{ marginRight: "8px" }} />,
  patrimoine: <FaBuilding style={{ marginRight: "8px" }} />,
  banque: <FaUniversity style={{ marginRight: "8px" }} />,
  intervenant: <FaUsers style={{ marginRight: "8px" }} />,
  tresorerie: <FaMoneyBill style={{ marginRight: "8px" }} />,
  retraite: <FaRegClock style={{ marginRight: "8px" }} />,
};

const GestionDossier = ({ client, row, onClose, dossiers, debiteur }) => {
  const [activeSection, setActiveSection] = useState("detail");
  const [activeTab, setActiveTab] = useState(null);
  const [activeSidebarButton, setActiveSidebarButton] = useState("detail");
  const [hoveredSidebar, setHoveredSidebar] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [notifsCount, setNotifCount] = useState({});
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(client);
  const [actions, setActions] = useState([
    { action: "Test Action", dateActionPrevue: "2025-07-28" },
  ]);
    const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  const handleAddAction = (newAction) => {
    setActions([...actions, { ...newAction, id: actions.length + 1 }]);
    setShowActionPopup(false);
  };
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(`http://${HOST}:${PORT}`);
    const socket = socketRef.current;
    const handleConnect = () => {
      console.log("✅ Connected to socket server Notif count:", socket.id);
      socket.emit("NotifCount", Number(localStorage.getItem("UserId")));
    };

    const handleData = ({ userId, count }) => {
      console.log("UserId : ", userId);
      if (userId == localStorage.getItem("UserId")) {
        console.log("📦 Received Notif Count:", count);
        setNotifCount(count[selectedClient.dossier.id] || {});
        console.log(count[selectedClient.dossier.id]);
      }
    };

    const handleError = (errMsg) => {
      console.error("❌ Error received:", errMsg);
      setError(errMsg);
    };

    // Listen to socket events
    socket.on("connect", handleConnect);
    socket.on("NotifCount", handleData);
    socket.on("NotifCountError", handleError);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("NotifCount", handleData);
      socket.off("NotifCountError", handleError);
    };
  }, []);

  const switchDossier = (newDossier) => {
    setSelectedClient(newDossier);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "action":
        return (
          <Action
            actions={actions}
            dossier={selectedClient}
            onAddAction={handleAddAction}
          />
        );
      case "encaissement":
        return <Encaissement dossier={selectedClient} />;
      case "contentieux":
        return <Contentieux />;
      case "piece":
        return <PieceJointe dossier={selectedClient} />;
      case "creance":
        return <Creance dossier={selectedClient}/>;
      case "historique":
        return <Historique id={selectedClient.dossier.debiteurId}/>;
      case "commentaire":
        return <Commentaire id={selectedClient.dossier.id}/>;
      default:
        return (
          <DetailDossier
            debiteur={debiteur}
            onClose={onClose}
            data={dossiers}
            actions={actions}
            dossier={selectedClient}
            AllDossiers = {dossiers}
            switchDossier = {switchDossier}
          />
        );
    }
  };

  const readNotifCount = async (cadrage, count) => {
    if (cadrage != null && count > 0) {
      try {
        const res = await axios.post(`http://${HOST}:${PORT}/readCountNotif`, {
          userId: Number(localStorage.getItem("UserId")),
          dossierId: selectedClient.dossier.id,
          cadrage: cadrage,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const renderDebiteurSection = () => {
    switch (activeSection) {
      case "débiteur":
        return <Débiteur dossiers={dossiers} dossier={selectedClient} row={row} />;
      case "employeur":
        return <Employeur dossier={selectedClient} />;
      case "adresse":
        return <Adresse dossier={selectedClient} />;
      case "patrimoine":
        return <Patrimoine dossier={selectedClient} />;
      case "banque":
        return <Banque dossier={selectedClient} />;
      case "intervenant":
        return <Intervenant dossier={selectedClient} />;
      case "tresorerie":
        return <Tresorerie dossier={selectedClient} />;
      case "retraite":
        return <Retraite dossier={selectedClient} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          width: "90%",
          height: "90vh",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div
          style={{
            backgroundColor: "#4b0101ff",
            width: "170px",
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            gap: "1rem",
            paddingTop: "2rem",
            // alignItems: 'center'
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: "150px", marginBottom: "0.5rem" }}
            // onClick={(e) => setActiveSection('detail')}
          />

          <button
            style={getSidebarButtonStyle(
              "detail",
              activeSidebarButton,
              hoveredSidebar
            )}
            onMouseEnter={() => setHoveredSidebar("detail")}
            onMouseLeave={() => setHoveredSidebar(null)}
            onClick={() => {
              setActiveSection("detail");
              setActiveTab(null);
              setActiveSidebarButton("detail");
            }}
          >
            {iconMap.detail}{" "}
            <span style={{ paddingLeft: "8px" }}>DETAIL DOSSIER</span>
          </button>

          {[
            [
              "débiteur",
              "DÉBITEUR",
              notifsCount["Cadrage Téléphonique"] || null,
              "Cadrage Téléphonique",
            ],
            [
              "adresse",
              "ADRESSE",
              notifsCount["Cadrage Adresse"] || null,
              "Cadrage Adresse",
            ],
            [
              "employeur",
              "EMPLOYEUR",
              notifsCount["Cadrage CNSS"] || null,
              "Cadrage CNSS",
            ],
            [
              "patrimoine",
              "PATRIMOINE",
              notifsCount["Cadrage Patrimoine"] || null,
              "Cadrage Patrimoine",
            ],
            [
              "banque",
              "BANQUES",
              notifsCount["Cadrage Banque"] || null,
              "Cadrage Banque",
            ],
            ["intervenant", "INTERVENANT", null, null],
            ["tresorerie", "TRÉSORERIE", null, null],
            ["retraite", "RETRAITE", null, null],
          ].map(([key, label, count, cadrage]) => (
            <button
              key={key}
              style={getSidebarButtonStyle(
                key,
                activeSidebarButton,
                hoveredSidebar
              )}
              onMouseEnter={() => setHoveredSidebar(key)}
              onMouseLeave={() => setHoveredSidebar(null)}
              onClick={() => {
                setActiveSection(key);
                setActiveSidebarButton(key);
                readNotifCount(cadrage,count);
              }}
            >
              {/* Icon wrapper */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginRight: "8px",
                }}
              >
                {iconMap[key]}
                {localStorage.getItem("Role") === "GESTIONNAIRE" &&
                  count > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        fontSize: "10px",
                        borderRadius: "50%",
                        height: "18px",
                        width: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {count > 10 ? "10+" : count}
                    </span>
                  )}
              </div>
              {label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "2rem",
              color: "red",
              cursor: "pointer",
            }}
          >
            &times;
          </button>

          {activeSection === "detail" ? (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  backgroundColor: "#4b0101ff",
                  padding: "0.5rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                {[
                  "action",
                  "creance",
                  "encaissement",
                  "historique",
                  "commentaire",
                  "contentieux",
                  "piece",
                ].map((tab) => (
                  <button
                    key={tab}
                    style={getNavButtonStyle(tab, activeTab, hoveredTab)}
                    onMouseEnter={() => setHoveredTab(tab)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flex: 1 }}>
                {[
                  "action",
                  "encaissement",
                  "contentieux",
                  "piece",
                  null,
                ].includes(activeTab) && (
                  <div
                    style={{
                      flex: "0 0 170px",
                      borderRight: "1px solid #ccc",
                      padding: "1rem",
                      height:"600px",
                      overflow: "auto",
                    }}
                  >
                    <Timeline
                      dossier={selectedClient}
                      title="Timeline"
                      actions={actions}
                    />
                  </div>
                )}
                <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
                  {renderTabContent()}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: "1rem", flex: 1 }}>
              {renderDebiteurSection()}
            </div>
          )}

          {showActionPopup && (
            <PopupAction
              onClose={() => setShowActionPopup(false)}
              onSave={handleAddAction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const getSidebarButtonStyle = (buttonName, active, hover) => ({
  padding: "0.5rem",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  backgroundColor:
    active === buttonName
      ? "white"
      : hover === buttonName
      ? "rgba(200,200,200,0.3)"
      : "transparent",
  color: active === buttonName ? "black" : "white",
  fontWeight: "bold",
  display: "flex",
  alignItems: "left",
});

const getNavButtonStyle = (tab, active, hover) => ({
  padding: "0.8rem 1rem",
  backgroundColor:
    active === tab
      ? "white"
      : hover === tab
      ? "rgba(200,200,200,0.3)"
      : "transparent",
  color: active === tab ? "black" : "white",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
});

export default GestionDossier;
