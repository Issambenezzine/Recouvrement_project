import React, { useState, useRef, useEffect } from 'react';
import moment from "moment"
import axios from 'axios';

export default function Debiteur({ dossier, dossiers, row }) {

  // Fusionner tous les dossiers liés au débiteur
  // let allDossiers = [];
  // if (Array.isArray(dossiers) && dossiers.length > 0) {
  //   allDossiers = dossiers;
  // } else if (row?.dossiers && Array.isArray(row.dossiers)) {
  //   allDossiers = row.dossiers;
  // } else if (dossier?.allDossiers && Array.isArray(dossier.allDossiers)) {
  //   allDossiers = dossier.allDossiers;
  // } else if (row?.nombre_dossier > 1 && row?.id_debiteur) {
  //   allDossiers = [dossier, ...(row.dossiers || [])];
  // } else {
  //   allDossiers = [dossier];
  // }

  // Forcer le nombre de dossiers à venir de row.nombre_dossier si présent
  const dossierCount = () => {
    console.log("dossiers : ",dossiers)
    return dossiers.filter(row => row.debiteurInfo?.debiteur?.CIN === dossier.debiteurInfo?.debiteur?.CIN).length;
};;

  const allDossiers = () => {
    return dossiers.filter(row => row.debiteurInfo?.debiteur?.CIN === dossier.debiteurInfo?.debiteur?.CIN);
  }

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [dossierCIN,setDossiers] = useState([]);
  const [count,setCount] = useState()

  const handleDossierClick = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(()=>{
    const fetchDossiers = async() => {
      try {
        const res = await axios.get('http://localhost:3004/dossier/dossiers?cin=${dossier.debiteurInfo?.debiteur?.CIN}');
        setDossiers(res.data)
        setCount(res.data.length)
      }catch(err) {
        console.log(err.message)
      }
    };
    fetchDossiers();
  },[])

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const fields = [
    { label: "Nom", value: dossier?.debiteurInfo?.debiteur?.nom },
    { label: "N°CIN", value: dossier?.debiteurInfo?.debiteur?.CIN },
    { label: "Date de naissance", value: dossier?.debiteurInfo?.debiteur?.date_naissance },
    { label: "Débiteur professionnel", value: dossier?.debiteurInfo?.debiteur?.profession },
    { label: "Débiteur adresse", value: dossier?.debiteurInfo?.addresses[0]?.addresseDebiteur},
    { label: "Débiteur ville", value: dossier?.debiteurInfo?.addresses[0]?.ville },
    { label: "N°Téléphone1", value: dossier?.debiteurInfo?.debiteur?.debiteur_tel1 },
    { label: "N°Téléphone2", value: dossier?.debiteurInfo?.debiteur?.debiteur_tel2 },
  ];

  const isMobile = window.innerWidth <= 600;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                  onClick={() => setShowDropdown(false)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong>📁 {'Dossier ${d.NDossier}'}</strong>
                      {/* {d.etat && (
                        <span style={{
                          backgroundColor: '#f0f0f0',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.8em',
                          color: '#555'
                        }}>
                          {d.etat}
                        </span>
                      )} */}
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#555', marginBottom: '4px' }}>
                      {d.nom && (
                        <div>👤 {d.nom}</div>
                      )}
                      {d.CIN && (
                        <div>🆔 <strong>CIN: </strong>{d.CIN}</div>
                      )}
                      {d.Manager && (
                        <div>👨‍💼<strong>Manager: </strong>{d.Manager}</div>
                      )}
                       {d.Gestionnaire && (
                        <div>🧑<strong>Gestionnaire: </strong>{d.Gestionnaire}</div>
                      )}

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
  // cursor: 'pointer',
  fontSize: '0.9rem',
  marginBottom: '1.5rem'
};