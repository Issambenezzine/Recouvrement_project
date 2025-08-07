import React from 'react';
// import Timeline from './Timeline'; // Ne pas oublier l'import

const DetailDossier = ({ dossier, actions = [] }) => {
  return (
    <div style={styles.container}>
      
      {/* === Timeline à gauche === */}
      {/* <div style={styles.timelineSection}>
        <Timeline title="TIMELINE" dossier={dossier} actions={actions} />
      </div> */}

      {/* === Informations du débiteur à droite === */}
      <div style={styles.infoSection}>
        <h2 style={styles.title}>{dossier.debiteurInfo.debiteur.nom}</h2>

        <div style={styles.grid}>
          {[
            ['Client', dossier.client.marche || "-"],
            ['N° dossier', dossier.dossier.NDossier || "-"],
            ['Responsable', dossier.manager || "-"],
            ['N° lot', dossier.dossier.lotId || "-"],
            ['Gestionnaire', dossier.gestionnaire || "-"],
            ['Type de lot', dossier.dossier.type || "-"],
            ['Téléphone 1', dossier.debiteurInfo.debiteur.debiteur_tel1 || "-"],
            ['Téléphone 2', dossier.debiteurInfo.debiteur.debiteur_tel2 || "-"],
            ['Créance', dossier.creance.creance || "-"],
            ['Frais divers', dossier.creance.autreFrais || "-"],
            ['Intérêts de retard', '0.00'],
            ['Total à régler initial', (dossier.creance.creance+dossier.creance.autreFrais) || "-"],
            ['Encaissement', '0.00'],
            ['Total à régler',  (dossier.creance.creance+dossier.creance.autreFrais) || "-"],
            ['Encaissés', '0.00'],
            ['Remise globale', '0.00'],
            ['Solde', dossier.creance.capital || "-"],
          ].map(([label, value], index) => (
            <div key={index}>
              <strong style={styles.label}>{label}:</strong>
              <div style={styles.input}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* === STYLES === */
const styles = {
  container: {
    display: 'flex',
    gap: '1rem',
    padding: '0.6rem',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#333'
  },
  timelineSection: {
    flex: '0 0 220px',
    padding: '1rem',
    backgroundColor: '#fafafa',
    border: '1px solid #ddd',
    borderRadius: '8px',
    height: '100%',
    overflowY: 'auto'
  },
  infoSection: {
    flex: 1
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '0.6rem',
    marginTop: '0rem',
    fontSize: '1.7rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.7rem',
    backgroundColor: '#f4f4f4',
    padding: '0.6rem',
    borderRadius: '8px'
  },
  label: {
    fontSize: '0.85rem'
  },
  input: {
    marginTop: '0px',
    padding: '6px 10px',
    backgroundColor: '#eee',
    borderRadius: '4px',
    fontWeight: '500',
    fontSize: '0.85rem'
  }
};

export default DetailDossier;
