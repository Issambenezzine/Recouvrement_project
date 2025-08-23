import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header_Manager from "./header_manager.jsx";
import Agenda_manager from "./Agenda_manager.jsx";
import G_gestionnaires from "./G_gestionnaires.jsx";
import GestionDossier from "./GestionDossier.jsx"; // ✅ import manquant
import { useEffect, useState, useRef } from "react";
import P_Commission from "../P_commission.jsx";
import { useNavigate } from "react-router-dom";
// import {useSocketDossiersAgenda} from "./hooks/socketHook.js"
import { io } from "socket.io-client";
import axios from "axios";
export default function ManagerPage() {
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
          role: "RESPONSABLE",
        });
      };
  
      const handleData = ({ dossiers, id, role }) => {
        if (role === "RESPONSABLE" && id == localStorage.getItem("UserId")) {
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
      <Header_Manager />
      <div style={{ paddingTop: "120px" }}>
        <Routes>
          <Route path="agenda" element={<Agenda_manager data={data} />} />
          <Route path="gestionnaires" element={<G_gestionnaires />} />
          <Route path="pilotage" element={<P_Commission data={data} />} />
          <Route path="/dossier" element={<GestionDossier data={data}/>} />
          <Route path="/" element={<Navigate to="agenda" replace />} />
        </Routes>
      </div>
    </div>
  );
}
