import React from 'react';

export default function Employeur({ dossier }) {
  const debiteur = dossier?.debiteurInfo || {};

  return (
    <div style={containerStyle}>
     {/* Partie employeur dans un tableau */}
      <h3 style={{ ...titleStyle, marginTop: '2rem', fontSize: '1.1rem' }}>Informations de l’employeur</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th> numero de dossier</th>
            <th>Nom et Prénom</th>
            <th>Employeur adresse</th>
            <th>Employeur ville</th>
            <th>N°Téléphone1</th>
            <th>N°Téléphone2</th>
          </tr>
        </thead>
        <tbody>
          <tr style={tbodyRowStyle}>
            <td>{debiteur.id || '...'}</td>
            <td>{debiteur.numeroDossier || '...'}</td>
            <td>{debiteur.nomPrenom || '...'}</td>
            <td>{debiteur.adresse || '...'}</td>
            <td>{debiteur.ville || '...'}</td>
            <td>{debiteur.telephone1 || '...'}</td>
            <td>{debiteur.telephone2 || '...'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


// Styles
const containerStyle = {
  padding: '1rem',
  fontFamily: 'Segoe UI, sans-serif',
  maxWidth: '900px',
  margin: '0 auto'
};

const titleStyle = {
  marginBottom: '1rem',
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#4b0101',
  textAlign: 'left'
};

const formContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1.5fr',
  rowGap: '0.8rem',
  columnGap: '1rem',
  fontSize: '0.95rem'
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
  padding: '0.6rem 1rem',
  borderRadius: '4px',
  minHeight: '2.2rem',
  display: 'flex',
  alignItems: 'center',
  wordBreak: 'break-word'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
  fontSize: '0.9rem'
};

const theadStyle = {
  backgroundColor: '#e3e3e3',
  textAlign: 'center',
  fontWeight: 'bold'
};

const tbodyRowStyle = {
  textAlign: 'center',
  backgroundColor: '#fff',
  borderTop: '1px solid #ccc'
};
