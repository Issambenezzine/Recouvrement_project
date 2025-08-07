import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header_Admin from './Header_Admin';
import Gestion_dossierG from './gestionnaire/gestion_dossierG';
import MesEncaissements from './gestionnaire/MesEncaissements';

export default function DetailGestionnaire() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('dossiers');

  const tabStyle = {
    padding: '10px 20px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px 5px 0 0',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
    fontWeight: '500',
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#4b0101',
    color: 'white',
  };

  return (
    <div>
      <Header_Admin />
      <div style={{ paddingTop: '100px' }}>
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <button 
            style={activeTab === 'dossiers' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('dossiers')}
          >
            Dossiers
          </button>
          <button 
            style={activeTab === 'encaissements' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('encaissements')}
          >
            Mes Encaissements
          </button>
        </div>
        
        {activeTab === 'dossiers' ? (
          <Gestion_dossierG gestionnaireId={id} />
        ) : (
          <MesEncaissements gestionnaireId={id} />
        )}
      </div>
    </div>
  );
}
