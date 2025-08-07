import React from 'react';

export default function Tresorerie({ dossier }) {
  return (
    <div>
      <h2 style={titleStyle}>Informations du Tresorerie</h2>
      <p>Détails concernant le Tresorerie lié au dossier : <strong>{dossier?.NDossier}</strong></p>
    </div>
  );
}

const titleStyle = {
  marginBottom: '1rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#4b0101'
};
