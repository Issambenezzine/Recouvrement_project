import React, { useState } from 'react';
import {
  FaPlus, FaUser, FaBriefcase, FaBuilding, FaUniversity,
  FaUsers, FaMoneyBill, FaRegClock, FaFileAlt
} from 'react-icons/fa';
import logo from './assets/logo_blanc.png';
import PopupAction from './PopupAction';
import Timeline from './Timeline';
import Action from './Action';
import Encaissement from './Encaissement';
import Contentieux from './Contentieux';
import PieceJointe from './PieceJointe';
import Creance from './Creance';
import Historique from './Historique';
import Commentaire from './Commentaire';
import DetailDossier from './DetailDossier';

import Débiteur from './debiteur/Débiteur';
import Employeur from './debiteur/Employeur';
import Patrimoine from './debiteur/Patrimoine';
import Banque from './debiteur/Banque';
import Intervenant from './debiteur/Intervenant';
import Retraite from './debiteur/Retraite';
import Tresorerie from './debiteur/Tresorerie';

const iconMap = {
  detail: <FaFileAlt style={{ marginRight: '8px' }} />,
  débiteur: <FaUser style={{ marginRight: '8px' }} />,
  employeur: <FaBriefcase style={{ marginRight: '8px' }} />,
  patrimoine: <FaBuilding style={{ marginRight: '8px' }} />,
  banque: <FaUniversity style={{ marginRight: '8px' }} />,
  intervenant: <FaUsers style={{ marginRight: '8px' }} />,
  tresorerie: <FaMoneyBill style={{ marginRight: '8px' }} />,
  retraite: <FaRegClock style={{ marginRight: '8px' }} />
};

const GestionDossier = ({ client, row, onClose }) => {
  const [activeSection, setActiveSection] = useState('detail');
  const [activeTab, setActiveTab] = useState(null);
  const [activeSidebarButton, setActiveSidebarButton] = useState('detail');
  const [hoveredSidebar, setHoveredSidebar] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [actions, setActions] = useState([
    { action: 'Test Action', dateActionPrevue: '2025-07-28' }
  ]);

  const handleAddAction = (newAction) => {
    setActions([...actions, { ...newAction, id: actions.length + 1 }]);
    setShowActionPopup(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'action': return <Action actions={actions} dossier={client} onAddAction={handleAddAction} />;
      case 'encaissement': return <Encaissement />;
      case 'contentieux': return <Contentieux />;
      case 'piece': return <PieceJointe dossier={client} />;
      case 'creance': return <Creance />;
      case 'historique': return <Historique />;
      case 'commentaire': return <Commentaire />;
      default: return <DetailDossier actions={actions} dossier={client} />;
    }
  };

  const renderDebiteurSection = () => {
    switch (activeSection) {
      case 'débiteur': return <Débiteur dossier={client} row={row} />;
      case 'employeur': return <Employeur dossier={client} />;
      case 'patrimoine': return <Patrimoine dossier={client} />;
      case 'banque': return <Banque dossier={client} />;
      case 'intervenant': return <Intervenant dossier={client} />;
      case 'tresorerie': return <Tresorerie dossier={client} />;
      case 'retraite': return <Retraite dossier={client} />;
      default: return null;
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', width: '90%', height: '90vh', display: 'flex', overflow: 'hidden', position: 'relative' }} onClick={e => e.stopPropagation()}>

        {/* Sidebar */}
        <div style={{
          backgroundColor: '#4b0101ff',
          width: '170px',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          gap: '1rem',
          paddingTop: '2rem',
          alignItems: 'left'
        }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: '80px', height: '60px', marginBottom: '0.5rem'}}
          />

          <button
            style={getSidebarButtonStyle('detail', activeSidebarButton, hoveredSidebar)}
            onMouseEnter={() => setHoveredSidebar('detail')}
            onMouseLeave={() => setHoveredSidebar(null)}
            onClick={() => { setActiveSection('detail'); setActiveTab(null); setActiveSidebarButton('detail'); }}
          >{iconMap.detail}DETAIL DOSSIER</button>

          {[
            ['débiteur', 'DÉBITEUR'],
            ['employeur', 'EMPLOYEUR'],
            ['patrimoine', 'PATRIMOINE'],
            ['banque', 'BANQUES'],
            ['intervenant', 'INTERVENANT'],
            ['tresorerie', 'TRÉSORERIE'],
            ['retraite', 'RETRAITE']
          ].map(([key, label]) => (
            <button
              key={key}
              style={getSidebarButtonStyle(key, activeSidebarButton, hoveredSidebar)}
              onMouseEnter={() => setHoveredSidebar(key)}
              onMouseLeave={() => setHoveredSidebar(null)}
              onClick={() => { setActiveSection(key); setActiveSidebarButton(key); }}
            >{iconMap[key]}{label}</button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '2rem', color: 'red', cursor: 'pointer' }}>&times;</button>

          {activeSection === 'detail' ? (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#4b0101ff', padding: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 2 }}>
                {["action", "creance", "encaissement", "historique", "commentaire", "contentieux", "piece"].map((tab) => (
                  <button
                    key={tab}
                    style={getNavButtonStyle(tab, activeTab, hoveredTab)}
                    onMouseEnter={() => setHoveredTab(tab)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onClick={() => setActiveTab(tab)}
                  >{tab.toUpperCase()}</button>
                ))}
              </div>

              <div style={{ display: 'flex', flex: 1 }}>
                {['action', 'encaissement', 'contentieux', 'piece', null].includes(activeTab) && (
                  <div style={{ flex: '0 0 170px', borderRight: '1px solid #ccc', padding: '1rem' }}>
                    <Timeline dossier={client} title="Timeline" actions={actions} />
                  </div>
                )}
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>{renderTabContent()}</div>
              </div>
            </>
          ) : (
            <div style={{ padding: '1rem', flex: 1 }}>{renderDebiteurSection()}</div>
          )}

          {showActionPopup && (
            <PopupAction onClose={() => setShowActionPopup(false)} onSave={handleAddAction} />
          )}
        </div>
      </div>
    </div>
  );
};

const getSidebarButtonStyle = (buttonName, active, hover) => ({
  padding: '0.5rem',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  backgroundColor: active === buttonName ? 'white' : hover === buttonName ? 'rgba(200,200,200,0.3)' : 'transparent',
  color: active === buttonName ? 'black' : 'white',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center'
});

const getNavButtonStyle = (tab, active, hover) => ({
  padding: '0.8rem 1rem',
  backgroundColor: active === tab ? 'white' : hover === tab ? 'rgba(200,200,200,0.3)' : 'transparent',
  color: active === tab ? 'black' : 'white',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold'
});

export default GestionDossier;
