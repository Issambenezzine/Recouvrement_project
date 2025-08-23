import React from 'react';

export default function FicheDossier() {
  const timeline = [
    { label: 'INITIÉ', date: '18/02/2025', color: '#a78bfa' },
    { label: 'Restitué', date: '18/02/2025', color: '#a78bfa' },
    { label: 'INITIÉ', date: '18/02/2025', color: '#a78bfa' },
  ];

  const infos = [
    { label: 'Client', value: 'AL AMANA' },
    { label: 'N°dossier', value: '2119647' },
    { label: 'Responsable', value: 'MENOUAR HAMZA' },
    { label: 'N°lot', value: '7101' },
    { label: 'Gestionnaire', value: 'BARHDADI FAIZA' },
    { label: 'Type de lot', value: 'CONTENTIEUX' },
    { label: 'Créance', value: '23 370.00' },
    { label: 'Frais divers', value: '0.00' },
    { label: 'Intérêts de retard', value: '0.00' },
    { label: 'Total à régler initial', value: '23 370.00' },
    { label: 'Encaissement', value: '0.00' },
    { label: 'Solde', value: '23 370.00' },
    { label: 'Total à régler', value: '23 370.00' },
    { label: 'Encaissés', value: '0.00' },
    { label: 'Remise globale', value: '0.00' },
    { label: 'Solde', value: '23 370.00' },
  ];

  return (
    <div className="fiche-dossier">
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0 }}>NOM DE DEBITEUR</h3>
          <p style={{ margin: 0 }}>CIN: <strong>BK3459328</strong></p>
        </div>
        <div style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.4rem 1rem', borderRadius: '999px' }}>
          Dossier 000000000001
        </div>
      </div>

      {/* Deux colonnes : timeline + infos */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Infos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
          width: '70%',
          background: '#f9fafb',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          {infos.map((item, index) => (
            <div key={index}>
              <label style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#374151' }}>{item.label}:</label>
              <input
                type="text"
                readOnly
                value={item.value}
                style={{
                  width: '100%',
                  padding: '0.4rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: '#f3f4f6',
                  color: '#111827',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
