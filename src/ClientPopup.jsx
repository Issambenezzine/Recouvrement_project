import React from "react";
import { FaTimes } from "react-icons/fa";

export default function ClientPopup({ client, onClose }) {
  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    width: '400px',
    maxWidth: '90%',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#666',
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={popupStyle}>
        <button style={closeButtonStyle} onClick={onClose}>
          <FaTimes />
        </button>
        <h3 style={{ marginBottom: '15px', color: '#1e40af' }}>Informations du client</h3>
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Client:</strong> {client.client}</p>
          <p><strong>Débiteur:</strong> {client.debiteur}</p>
          <p><strong>Numéro de pièce:</strong> {client.piece}</p>
          <p><strong>Dossier:</strong> {client.dossier}</p>
          <p><strong>Solde:</strong> {client.solde}</p>
          <p><strong>Gestionnaire:</strong> {client.gestionnaire}</p>
        </div>
      </div>
    </>
  );
}