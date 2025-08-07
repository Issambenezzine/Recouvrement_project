import React from 'react';

export default function Intervenant({ dossier }) {
  const intervenant = dossier?.intervenant || {}; // à adapter selon ta structure réelle
  const dossierInfo = dossier?.dossier || {};

  return (
    <div style={containerStyle}>
      <h3 style={{ ...titleStyle, marginTop: '2rem', fontSize: '1.1rem' }}>Informations intervenant / cautionneur</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th>N° dossier</th>
            <th>N°CIN</th>
            <th>Cautionneur adresse</th>
            <th>Cautionneur ville</th>
            <th>N°Téléphone1</th>
            <th>N°Téléphone2</th>
          </tr>
        </thead>
        <tbody>
          <tr style={tbodyRowStyle}>
            <td>{intervenant.id || '—'}</td><td>{dossierInfo.NDossier || '—'}</td>
            <td>{intervenant.cin || '—'}</td><td>{intervenant.adresse || '—'}</td>
            <td>{intervenant.ville || '—'}</td><td>{intervenant.telephone1 || '—'}</td>
            <td>{intervenant.telephone2 || '—'}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
  );
}
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

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
  fontSize: '0.9rem',
  border: '1px solid #ccc'
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