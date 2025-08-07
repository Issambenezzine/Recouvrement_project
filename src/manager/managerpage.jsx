import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header_Manager from "./header_manager.jsx";
import Agenda_manager from "./Agenda_manager.jsx";
import G_gestionnaires from "./G_gestionnaires.jsx";
import GestionDossier from "./GestionDossier.jsx"; 
import P_commission from "../P_commission.jsx";
import Parametrage from "../Parametrage.jsx";

export default function ManagerPage() {
  return (
    <div>
      <Header_Manager />
      <div style={{ paddingTop: "120px" }}>
        <Routes>
          <Route path="agenda" element={<Agenda_manager />} />
          <Route path="gestionnaires" element={<G_gestionnaires />} />
          <Route path="/pilotage" element={<P_commission/>} />
          <Route path="parametrage" element={<Parametrage />} />
          <Route path="/dossier" element={<GestionDossier />} />
          <Route path="/" element={<Navigate to="agenda" replace />} />
        </Routes>
      </div>
    </div>
  );
}
