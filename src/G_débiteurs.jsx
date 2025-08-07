import React, { useState, useMemo } from 'react';
import { FaSync, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

// données d’exemple
const initialData = [ /* … */ ];

// filtres initiaux
const initialFilters = {
  dossierInterne: '',
  dossierExterne: '',
  client: '',
  debiteur: '',
  minMontant: '',
  maxMontant: '',
  dateFrom: '',
  dateTo: '',
  typeReglement: '',
  modeReglement: '',
  responsable: ''
};

export default function G_débiteurs() {
  const [data, setData]       = useState(initialData);
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const handleRefresh = () => {
    setData(initialData);
    setFilters(initialFilters);
  };

  const filteredData = useMemo(() => {
    return data.filter(r => {
      if (filters.dossierInterne && !r.dossierInterne.includes(filters.dossierInterne)) return false;
      if (filters.dossierExterne && !r.dossierExterne.includes(filters.dossierExterne)) return false;
      if (filters.client && r.client.marche !== filters.client) return false;
      if (filters.debiteur && !r.debiteur.toLowerCase().includes(filters.debiteur.toLowerCase())) return false;
      if (filters.minMontant && parseFloat(r.montant) < parseFloat(filters.minMontant)) return false;
      if (filters.maxMontant && parseFloat(r.montant) > parseFloat(filters.maxMontant)) return false;
      if (filters.dateFrom && r.date < filters.dateFrom) return false;
      if (filters.dateTo && r.date > filters.dateTo) return false;
      if (filters.typeReglement && r.typeReglement !== filters.typeReglement) return false;
      if (filters.modeReglement && r.modeReglement !== filters.modeReglement) return false;
      if (filters.responsable && r.responsable !== filters.responsable) return false;
      return true;
    });
  }, [data, filters]);

  const grouped = useMemo(() => {
    const map = {};
    filteredData.forEach(r => {
      const key = r.debiteur;
      if (!map[key] || parseFloat(r.montant) > parseFloat(map[key].montant)) {
        map[key] = r;
      }
    });
    return Object.values(map);
  }, [filteredData]);

  const exportToExcel = () => {
    const exportData = grouped.map(r => ({
      Client: r.client.marche,
      'Intitulé débiteur': r.debiteur,
      'N° pièce': r.id_recu,
      '# Dossier': r.dossierInterne,
      Solde: r.montant,
      Gestionnaire: r.gestionnaire.nom,
      Status: r.typeReglement,
      'Actions en cours': r.responsable
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Débiteurs');
    XLSX.writeFile(wb, 'debitieurs.xlsx');
  };

  // Styles
  const fieldStyle = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    marginBottom: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  };
  const thStyle = {
    padding: '0.5rem',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#c4b6b8ff',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '0.75rem'
  };
  const tdStyle = {
    padding: '0.5rem',
    borderBottom: '1px solid #eee',
    textAlign: 'center'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '1rem',
      backgroundColor: '#fff',
      boxSizing: 'border-box'
    }}>
      {/* entête */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{ margin: 0, flex: 1 }}>Liste des débiteurs</h2>
     
        <button onClick={exportToExcel} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.5rem 1rem',
          marginLeft: '0.5rem',
          background: '#05514fff',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}>
          <FaFileExcel /> Excel
        </button>
      </div>

      {/* contenu */}
      <div style={{
        display: 'flex',
        flex: 1,
        gap: '1rem',
        overflow: 'hidden',
        marginTop: '1rem',
      }}>
        {/* sidebar filtres */}
        <div style={{
          width: '260px',
          minWidth: '260px',
          padding: '1rem',
          background: '#f9f9f9',
          borderRadius: 4,
          boxSizing: 'border-box',
          marginTop: '-1.0rem',
        
        }}>
          <input
            type="text"
            name="dossierInterne"
            placeholder="Dossier interne"
            value={filters.dossierInterne}
            onChange={handleFilterChange}
           style={{ width: '100%', padding: '0.3rem', marginTop: '0.3rem' }}
          />
          <input
            type="text"
            name="dossierExterne"
            placeholder="Dossier externe"
            value={filters.dossierExterne}
            onChange={handleFilterChange}
           style={{ width: '100%', padding: '0.3rem', marginTop: '0.3rem' }}
          />
          <select
            name="client"
            value={filters.client}
            onChange={handleFilterChange}
           style={{ width: '106%', padding: '0.3rem', marginTop: '0.3rem' }}
          >
            <option value="">Tous les clients</option>
            {[...new Set(data.map(r => r.client.marche))].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="text"
            name="debiteur"
            placeholder="Débiteur"
            value={filters.debiteur}
            onChange={handleFilterChange}
           style={{ width: '100%', padding: '0.3rem', marginTop: '0.3rem' }}
          />
          <input
            type="number"
            name="minMontant"
            placeholder="Montant min"
            value={filters.minMontant}
            onChange={handleFilterChange}
            style={{ width: '100%', padding: '0.3rem', marginTop: '0.3rem' }}
          />
          <input
            type="number"
            name="maxMontant"
            placeholder="Montant max"
            value={filters.maxMontant}
            onChange={handleFilterChange}
           style={{ width: '100%', padding: '0.3rem', marginTop: '0.3rem' }}
          />
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
           style={{ width: '100%', padding: '0.3rem', marginTop: '0.3rem' }}
          />
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
           style={{ width: '100%', padding: '0.3rem', marginTop: '0.3rem' }}
          />
          <select
            name="typeReglement"
            value={filters.typeReglement}
            onChange={handleFilterChange}
          style={{ width: '106%', padding: '0.3rem', marginTop: '0.3rem' }}
          >
            <option value="">Type règlement</option>
            <option value="Espèces">Espèces</option>
            <option value="Chèque">Chèque</option>
          </select>
          <select
            name="modeReglement"
            value={filters.modeReglement}
            onChange={handleFilterChange}
            style={{ width: '106%', padding: '0.3rem', marginTop: '0.3rem' }}
          >
            <option value="">Mode règlement</option>
            <option value="Virement">Virement</option>
            <option value="Tip">Tip</option>
          </select>
          <select
            name="responsable"
            value={filters.responsable}
            onChange={handleFilterChange}
          style={{ width: '106%', padding: '0.3rem', marginTop: '0.3rem' }}
          >
            <option value="">Responsable</option>
            {[...new Set(data.map(r => r.responsable))].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        

        {/* tableau */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          background: '#fff',
          borderRadius: 4,
          boxShadow: '0 0 5px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[
                  'Client',
                  'Intitulé débiteur',
                  'N° pièce',
                  '# Dossier',
                  'Solde',
                  'Gestionnaire',
                  'Status',
                  'Actions en cours'
                ].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grouped.map((r, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td style={tdStyle}>{r.client.marche}</td>
                  <td style={tdStyle}>{r.debiteur}</td>
                  <td style={tdStyle}>{r.id_recu}</td>
                  <td style={tdStyle}>{r.dossierInterne}</td>
                  <td style={tdStyle}>{r.montant}</td>
                  <td style={tdStyle}>{r.gestionnaire.nom}</td>
                  <td style={tdStyle}>{r.typeReglement}</td>
                  <td style={tdStyle}>{r.responsable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}