import React from 'react';

const ConfirmDeletePopup = ({ onConfirm, onCancel,username }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Confirmer la suppression</h3>
        <p>Voulez-vous vraiment supprimer cet utilisateur <label style={{fontWeight:"bolder"}}>{username}</label> ?</p>
        <div className="popup-buttons">
          <button onClick={onConfirm}>Oui</button>
          <button onClick={onCancel}>Non</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
