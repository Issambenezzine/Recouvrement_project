

import React, { useState, useRef, useEffect } from 'react';
import moment from "moment"
import axios from 'axios';

export default function Debiteur({ dossier, dossiers, row }) {
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [dossierCIN,setDossiers] = useState([]);
  const [count,setCount] = useState()

  const handleDossierClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(()=>{
    const fetchDossiers = async() => {
      try {
        const res = await axios.get(`http://${HOST}:${PORT}/dossier/dossiers?cin=${dossier.debiteurInfo?.debiteur?.CIN}`)
        setDossiers(res.data)
        setCount(res.data.length)
      }catch(err) {
        console.log(err.message)
      }
    };
    fetchDossiers();
  },[])

  // Handle dropdown item click without closing dropdown
  const handleDropdownItemClick = (e, dossierItem) => {
    e.stopPropagation(); // Prevent event from bubbling up
    
    // Add your logic here for what should happen when clicking a dossier item
    console.log('Selected dossier:', dossierItem);
    
    // If you want to close dropdown after selection, uncomment the line below:
    // setShowDropdown(false);
  };

  const fields = [
    { label: "Nom", value: dossier?.debiteurInfo?.debiteur?.nom },
    { label: "N°CIN", value: dossier?.debiteurInfo?.debiteur?.CIN },
    { label: "Date de naissance", value: moment(dossier?.debiteurInfo?.debiteur?.date_naissance).format("DD/MM/YYYY") },
    { label: "Débiteur professionnel", value: dossier?.debiteurInfo?.debiteur?.profession },
    { label: "N°Téléphone1", value: dossier?.debiteurInfo?.debiteur?.debiteur_tel1 },
    { label: "N°Téléphone2", value: dossier?.debiteurInfo?.debiteur?.debiteur_tel2 },
  ];

  const isMobile = window.innerWidth <= 600;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Informations du débiteur</h2>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            style={dossierButtonStyle} 
            onClick={handleDossierClick}
          >
            <span>📂 Dossiers: {count}</span>
          </button>

          {showDropdown && (
            <div style={styles.dropdown(showDropdown)}>
              {dossierCIN.map((d, idx) => (
                <div 
                  key={idx} 
                  style={dropdownItemStyle}
                  onClick={(e) => handleDropdownItemClick(e, d)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong>📁 {`Dossier ${d.NDossier}`}</strong>
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#555', marginBottom: '4px' }}>
                      {d.nom && (
                        <div>👤 {d.nom}</div>
                      )}
                      {d.CIN && (
                        <div>🆔 <strong>CIN: </strong>{d.CIN}</div>
                      )}
                        <div>👨‍💼<strong>Manager: </strong>{d.Manager || "--"}</div>
                        <div>🧑<strong>Gestionnaire: </strong>{d.Gestionnaire || "--"}</div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '0.8em',
                      color: '#666',
                      borderTop: '1px solid #eee',
                      paddingTop: '4px',
                      marginTop: '4px'
                    }}>
                      <div>
                        {d.createdAt && (
                          <div>📅 {moment(d.createdAt).format("DD/MM/YYYY")}</div>
                        )}
                      </div>
                      <div>
                        {d.capital && (
                          <div>💵 {parseFloat(d.creance).toFixed(2)} MAD</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={formWrapperStyle}>
        <div style={{
          ...formContainerStyle,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr'
        }}>
          {fields.map(({ label, value }, idx) => (
            <div key={idx} style={rowStyle}>
              <label style={labelStyle}>{label}</label>
              <div style={inputStyle}>{value || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  padding: '1rem',
  fontFamily: 'Segoe UI, sans-serif',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const titleStyle = {
  marginBottom: '1rem',
  fontSize: '1.3rem',
  fontWeight: '600',
  color: '#4b0101',
  textAlign: 'center'
};

const formWrapperStyle = {
  width: '100%',
  maxWidth: '800px'
};

const formContainerStyle = {
  border: '1px solid #ccc',
  borderRadius: '6px',
  padding: '1rem',
  display: 'grid',
  rowGap: '0.8rem',
  columnGap: '1rem',
  backgroundColor: '#f9f9f9',
  width: '100%',
  fontSize: '0.8rem'
};

const rowStyle = {
  display: 'contents'
};

const labelStyle = {
  fontWeight: '500',
  alignSelf: 'center',
  color: '#333'
};

const inputStyle = {
  backgroundColor: '#eee',
  padding: '0.2rem 0.2rem',
  borderRadius: '4px',
  minHeight: '0.2rem',
  display: 'flex',
  alignItems: 'center',
  wordBreak: 'break-word'
};

const headerStyle = {
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem'
};

const dossierButtonStyle = {
  padding: '10px 16px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  color: '#333',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  transition: 'all 0.2s ease'
};

const styles = {
  dropdown: (isVisible) => ({
    position: 'absolute',
    top: 'calc(100% + 5px)',
    right: 0,
    backgroundColor: 'white',
    border: '2px solid #4b0101',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    zIndex: 1000,
    minWidth: '350px',
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '12px',
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: 'all 0.3s ease'
  })
};

const dropdownItemStyle = {
  padding: '0.6rem',
  borderBottom: '1px solid #eee',
  // cursor: 'pointer', // Re-enabled cursor pointer
  fontSize: '0.9rem',
  marginBottom: '1.5rem',
  transition: 'background-color 0.2s ease', // Added hover effect
  ':hover': {
    backgroundColor: '#f5f5f5'
  }
};