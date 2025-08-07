import React from 'react';

export default function Banque({ dossier }) {
  const debiteur = dossier?.debiteurInfo?.debiteur || {};
  const client = dossier?.client || {};
  const creance = dossier?.creance || {};
  const dossierInfo = dossier?.dossier || {};

  return (
    <div style={containerStyle}>
      <h3 style={{ ...titleStyle, marginTop: '2rem', fontSize: '1.1rem' }}>Informations banque</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>N°</th>
            <th>N° de dossier</th>
            <th>Client</th>
            <th>Débiteur</th>
            <th>Catégorie</th>
            <th>Capital</th>
            <th>Créance</th>
            <th>En Retard</th>
            <th>Autre Frais</th>
            <th>Total</th>
            <th>Durée</th>
            <th>Mensualité</th>
          </tr>
        </thead>
        <tbody>
          <tr style={tbodyRowStyle}>
            <td>{debiteur.id || '...'}</td>
            <td>{dossierInfo.NDossier || '...'}</td>
            <td>{client.marche || '...'}</td>
            <td>{debiteur.nom || '...'}</td>
            <td>{dossierInfo.type || '...'}</td>
            <td>{creance.capital || '...'}</td>
            <td>{creance.creance || '...'}</td>
            <td>0.00</td> {/* valeur statique temporaire */}
            <td>{creance.autreFrais || '...'}</td>
            <td>{(creance.creance || 0) + (creance.autreFrais || 0)}</td>
            <td>{creance.duree || '...'}</td>
            <td>{creance.mensualite || '...'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ================= STYLES =================
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
