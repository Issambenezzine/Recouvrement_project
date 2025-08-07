import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Header_Admin from "./Header_Admin";
import G_débiteurs from "./G_débiteurs";
import G_profil from "./G_profil";
import Parametrage from "./Parametrage";
import Agenda from "./Agenda";
import G_Portefeuille from "./G_portefeuille";
import G_Dossier from "./G_dossier";
import G_encaissement from "./G_encaissement";
import DetailGestionnaire from './DetailGestionnaire'; 
import GestionDossierG from './gestionnaire/gestion_dossierG';
import P_commission from './P_commission';
import Cadrage from './Cadrage';

export default function Adminpage() {
  return (
    <div>
      <Header_Admin />
      <div style={{ paddingTop: '120px' }}> 
        <Routes>
          <Route path="/" element={<Navigate to="/admin/agenda" replace />} />
          <Route path="/debiteurs" element={<G_débiteurs />} />
          <Route path="/agenda" element={<Agenda/>} />
          <Route path="/portefeuille/*">
            <Route index element={<G_Portefeuille />} />
            <Route path="cadrage" element={<Cadrage />} />
          </Route>
          <Route path="/dossier" element={<G_Dossier/>} />
          <Route path="/encaissement" element={<G_encaissement/>} />
          <Route path="/profil" element={<G_profil/>} />
          <Route path="/pilotage" element={<P_commission/>} />
          <Route path="/parametrage" element={<Parametrage/>} />
          <Route path="/gestionnaire/:gestionnaireNom" element={<GestionDossierG />} />
          <Route path="/gestionnaire/:name" element={<GestionDossierG />} />
          <Route path="/admin/gestionnaire/:id" element={<DetailGestionnaire />} />
        </Routes>
      </div>
    </div>
  );
}