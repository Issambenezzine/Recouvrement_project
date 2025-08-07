import React from 'react';

export default function Patrimoine({ dossier }) {
  const debiteur = dossier?.debiteurInfo || {};

  return (
    <div style={containerStyle}>
      <h3 style={{ ...titleStyle, marginTop: '2rem', fontSize: '1.1rem' }}>Gestion des patrimoine</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>N°</th>
            <th> Conservation</th>
            <th>Titre Foncier</th>
            <th>Nombre de tire identifiés</th>
            <th> Source</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style={tbodyRowStyle}>
            <td>{debiteur.id || '...'}</td>
            <td>{debiteur.conservation || '...'}</td>
            <td>{debiteur.titreFoncier || '...'}</td>
            <td>{debiteur.nombreTireIdentifiés || '...'}</td>
            <td>{debiteur.source || '...'}</td>
            <td>{debiteur.statut || '...'}</td>
            <td>{debiteur.action || '...'}</td>
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
