import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ✅ Imports adaptés pour le dossier "gestionnaire"
import Header_Gestionnaire from "./header_gestionnaire";
import Agenda_gestionnaire from "./Agenda_gestionnaire";
import Carde_gestionnaire from "./Carde_gestionnaire"; // facultatif, utilisé dans Agenda
import GestionDossier from "../gestion_dossier"; // Si le fichier est à la racine ou à l’extérieur du dossier gestionnaire
import Parametrage from "../Parametrage"; // Si le fichier Parametrage.jsx est à la racine
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";
import P_Commission from "../P_commission";
import G_Dossier from "./G_dossier_gestionnaire"
import Mes_encaissement from "./MesEncaissements"
import Gestion_dossierG from "./gestion_dossierG";
export default function GestionnairePage() {
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
          role: "GESTIONNAIRE",
        });
      };
  
      const handleData = ({ dossiers, id, role }) => {
        console.log("UserId : ",localStorage.getItem("UserId"))
        if (role === "GESTIONNAIRE" && id == localStorage.getItem("UserId")) {
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
      <Header_Gestionnaire />
      <div style={{ paddingTop: "120px" }}>
        <Routes>
          <Route path="agenda" element={<Agenda_gestionnaire data={data}/>} />
          <Route
            path="mesencaissements"
            element={<Mes_encaissement data={data}/>}
          />
          <Route
            path="pilotage"
            element={<P_Commission data={data} />}
          />
          <Route path="dossier" element={<Gestion_dossierG data={data}/>} />
          <Route path="/GDossier" element={<G_Dossier/>} />
          <Route path="/" element={<Navigate to="/gestionnaire/agenda" replace />} />
        </Routes>
      </div>
    </div>
  );
}
