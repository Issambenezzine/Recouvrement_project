import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Header_Visiteur from "./header_visiteur";
import G_débiteurs from "../G_débiteurs";
import G_profil from "../G_profil";
import Agenda_v from "./Agenda_v";
import G_dossier from "../G_dossier";
import G_encaissement from "../G_encaissement";
import DetailGestionnaire from '../DetailGestionnaire'; 
import GestionDossierG from '../gestionnaire/gestion_dossierG';
import P_commission from '../P_commission';

export default function VisiteurPage() {
  console.log('VisiteurPage rendu, path:', window.location.pathname);
  return (
    <div style={{ border: '2px solid red', minHeight: '100vh', position: 'relative' }}>
      <Header_Visiteur />
      <div style={{ 
        paddingTop: '120px',
        border: '2px solid blue',
        minHeight: 'calc(100vh - 120px)',
        padding: '20px',
        backgroundColor: '#f0f0f0'
      }}>
        <Routes>
          {/* Redirection de la racine vers l'agenda */}
          <Route index element={<Navigate to="/visiteur/agenda" replace />} />

          {/* Routes visiteur */}
          <Route path="agenda" element={
            <div style={{ padding: '20px' }}>
              <Agenda_v />
            </div>
          } />
          <Route path="debiteurs" element={<G_débiteurs />} />
          <Route path="dossier" element={<G_dossier/>} />
          <Route path="encaissement" element={<G_encaissement />} />
          <Route path="profil" element={<G_profil />} />
          <Route path="pilotage" element={<P_commission />} />
          <Route path="gestionnaire/:gestionnaireNom" element={<GestionDossierG />} />
          <Route path="gestionnaire/:id" element={<DetailGestionnaire />} />
          
          {/* Redirection pour les chemins non reconnus */}
          <Route path="*" element={<Navigate to="/visiteur/agenda" replace />} />

        
        </Routes>
      </div>
    </div>
  );
}
