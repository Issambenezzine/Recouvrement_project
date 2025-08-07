import React, { useState } from 'react';
import { FaPlus, FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import PopupEncaissement from './PopupEncaissement';

const Encaissement = () => {
  const [encaissements, setEncaissements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [imageToView, setImageToView] = useState(null); // Pour la preview

  const handleAddEncaissement = (newEncaissement) => {
    const entry = {
      ...newEncaissement,
      modeReglement: newEncaissement.typeReglement,
      responsable: 'Utilisateur',
    };
    setEncaissements([...encaissements, entry]);
    setShowPopup(false);
  };

  return (
    <div style={{ width: '100%', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ padding: '1rem' }}>
        <h3 style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#004d40',
          fontSize: '18px'
        }}>
          GESTION DES ENCAISSEMENTS
          <FaPlus
            style={{ cursor: 'pointer', color: '#7d0022' }}
            onClick={() => setShowPopup(true)}
            title="Ajouter un encaissement"
          />
        </h3>

        <table style={{
          width: '95%',
          borderCollapse: 'collapse',
          marginTop: '1rem',
          fontSize: '13px',
          color: '#333',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#bdbdbd', color: 'black', textAlign: 'left' }}>
              {['N°', 'Date règlement', 'Type de règlement', 'Mode de règlement', 'Montant', 'Responsable', 'Fichier', 'Actions'].map(title => (
                <th key={title} style={{ padding: '10px 8px', borderBottom: '2px solid #999' }}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {encaissements.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  Aucun encaissement enregistré
                </td>
              </tr>
            ) : (
              encaissements.map((enc, index) => (
                <tr key={index}
                  style={{
                    borderBottom: '1px solid #ddd',
                    transition: 'background-color 0.3s',
                    cursor: 'default'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f8f6'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={{ padding: '10px' }}>{index + 1}</td>
                  <td style={{ padding: '10px' }}>{enc.dateReglement || '-'}</td>
                  <td style={{ padding: '10px' }}>{enc.typeReglement || '-'}</td>
                  <td style={{ padding: '10px' }}>{enc.modeReglement || '-'}</td>
                  <td style={{ padding: '10px' }}>{enc.montant ? `${parseFloat(enc.montant).toFixed(2)} MAD` : '-'}</td>
                  <td style={{ padding: '10px' }}>{enc.responsable || '-'}</td>
                  <td style={{ padding: '10px' }}>
                    {enc.filePreviewUrl ? (
                      <FaEye
                        style={{ cursor: 'pointer', color: '#00796b' }}
                        title="Voir l’image"
                        onClick={() => setImageToView(enc.filePreviewUrl)}
                      />
                    ) : '-'}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <FaEdit style={{ cursor: 'pointer', marginRight: 10 }} />
                    <FaTrash style={{ cursor: 'pointer', color: '#d32f2f' }} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showPopup && (
          <PopupEncaissement
            onClose={() => setShowPopup(false)}
            onSave={handleAddEncaissement}
          />
        )}

        {imageToView && (
          <div
            onClick={() => setImageToView(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <img
              src={imageToView}
              alt="Fichier"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '8px',
                boxShadow: '0 0 20px #000'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Encaissement;
