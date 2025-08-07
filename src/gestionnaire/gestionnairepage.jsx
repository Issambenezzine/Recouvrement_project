import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ✅ Imports adaptés pour le dossier "gestionnaire"
import Header_Gestionnaire from "./header_gestionnaire";
import Agenda_gestionnaire from "./Agenda_gestionnaire";
import Gestion_dossierG from "./gestion_dossierG"; 
import MesEncaissements from "./MesEncaissements";
import P_commission from "../P_commission.jsx";

export default function GestionnairePage() {
  return (
    <div>
      <Header_Gestionnaire />
      <div style={{ paddingTop: "120px" }}>
        <Routes>
          <Route path="agenda" element={<Agenda_gestionnaire />} />
          <Route path="MesEncaissements" element={<MesEncaissements />} />
          <Route path="pilotage" element={<P_commission />} />
          <Route path="dossier" element={<Gestion_dossierG />} />
          <Route path="/" element={<Navigate to="agenda" replace />} />
        </Routes>
      </div>
    </div>
  );
}
