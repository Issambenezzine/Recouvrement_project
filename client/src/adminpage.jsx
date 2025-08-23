import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header_Admin from "./Header_Admin";
import G_débiteurs from "./G_débiteurs";
import G_profil from "./G_profil";
import Parametrage from "./Parametrage";
import Login from "./login";
import Agenda from "./Agenda";
import G_Portefeuille from "./G_portefeuille";
import G_Dossier from "./G_dossier";
import G_encaissement from "./G_encaissement";
import P_Commission from "./P_commission";
import Cadrage from "./Cadrage";
import { useEffect, useState, useRef } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import StatCards from "./Carde";
import GestionDossier from "./gestion_dossier";
import GestionDossierG from "./gestionnaire/gestion_dossierG";
import Filtrage from "./Filtrage";
import { useNavigate } from "react-router-dom";
// import {useSocketDossiersAgenda} from "./hooks/socketHook.js"
import { io } from "socket.io-client";
import axios from "axios";
export default function Adminpage() {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  useEffect(() => {
    socketRef.current = io(`http://${HOST}:${PORT}`);
    const socket = socketRef.current;
    const handleConnect = () => {
      console.log("✅ Connected to socket server:", socket.id);
      socket.emit("getDossierAgenda", {
        id: localStorage.getItem("UserId"),
        role: "ADMIN",
      });
    };

    const handleData = ({ dossiers, id, role }) => {
      if (role === "ADMIN") {
        console.log("dossiers: ",dossiers)
        console.log("📦 Received dossiers:", JSON.parse(dossiers));
        setData(JSON.parse(dossiers));
        localStorage.setItem("dossiersAdmin", dossiers);
      }
    };

    const handleError = (errMsg) => {
      console.error("❌ Error received:", errMsg);
      setError(errMsg);
    };

    // Listen to socket events
    socket.on("connect", handleConnect);
    socket.on("dossiersAgendaData", handleData);
    socket.on("dossiersAgendaError", handleError);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("dossiersAgendaData", handleData);
      socket.off("dossiersAgendaError", handleError);
    };
  }, []);
  return (
    <div>
      <Header_Admin />
      <div style={{ paddingTop: "120px" }}>
        <Routes>
          <Route path="/debiteurs" element={<G_débiteurs dossiers={data}/>} />
          {/* <Route path="/login" element={<Login/>} /> */}
          <Route path="/agenda" element={<Agenda data={data} />} />
          <Route path="/portefeuille" element={<G_Portefeuille />} />
          <Route path="/dossier" element={<G_Dossier />} />
          <Route path="/portefeuille/*">
            <Route index element={<G_Portefeuille />} />
            <Route path="cadrage" element={<Cadrage />} />
          </Route>
          <Route path="/profil" element={<G_profil />} />
          <Route path="/pilotage" element={<P_Commission data={data} />} />
          <Route path="/parametrage" element={<Parametrage />} />
          <Route
            path="/encaissement"
            element={<G_encaissement data={data} />}
          />
          <Route
            path="/gestionnaire/:gestionnaireNom"
            element={<GestionDossierG data={data} />}
          />
          <Route
            path="/gestionnaire/:name"
            element={<GestionDossierG data={data} />}
          />
          <Route path="/" element={<Navigate to="/admin/agenda" replace />} />
        </Routes>
      </div>
    </div>
  );
}
