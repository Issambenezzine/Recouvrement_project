import React, { useState, useMemo } from 'react';
import { FaSync, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

// données d'exemple
const initialData = [
  {
    id_recu: 1,
    dossierInterne: 'INT-001',
    dossierExterne: 'EXT-123',
    client: { marche: 'Marché A', commissione: 'Commission 1' },
    debiteur: 'Ali',
    montant: '1500 DH',
    date: '2025-08-01',
    typeReglement: 'Espèces',
    modeReglement: 'Virement',
    gestionnaire: { nom: 'Ghita' },
    responsable: 'Yassine'
  },
  {
    id_recu: 2,
    dossierInterne: 'INT-002',
    dossierExterne: 'EXT-123',
    client: { marche: 'Marché A', commissione: 'Commission 1' },
    debiteur: 'AYMEN',
    montant: '1500 DH',
    date: '2025-04-21',
    typeReglement: 'Espèces',
    modeReglement: 'Virement',
    gestionnaire: { nom: 'NABIL' },
    responsable: 'GHITA'
  },
  {
    id_recu: 3,
    dossierInterne: 'INT-003',
    dossierExterne: 'EXT-123',
    client: { marche: 'Marché A', commissione: 'Commission 1' },
    debiteur: 'Ali',
    montant: '1500 DH',
    date: '2025-08-01',
    typeReglement: 'Espèces',
    modeReglement: 'Virement',
    gestionnaire: { nom: 'AYMEN' },
    responsable: 'IMANE'
  },
  {
    id_recu: 4,
    dossierInterne: 'INT-001',
    dossierExterne: 'EXT-1235',
    client: { marche: 'Marché A', commissione: 'Commission 1' },
    debiteur: 'Ali',
    montant: '1500 DH',
    date: '2025-18-01',
    typeReglement: 'Espèces',
    modeReglement: 'Virement',
    gestionnaire: { nom: 'AYA' },
    responsable: 'KHALID'
  },
  {
    id_recu: 5,
    dossierInterne: 'INT-0028',
    dossierExterne: 'EXT-456',
    client: { marche: 'Marché B', commissione: 'Commission 2' },
    debiteur: 'Sara',
    montant: '2500 DH',
    date: '2025-08-02',
    typeReglement: 'Chèque',
    modeReglement: 'Tip',
    gestionnaire: { nom: 'KENZA' },
    responsable: 'IMANE'
  } ,{
    id_recu: 1,
    dossierInterne: 'INT-001',
    dossierExterne: 'EXT-123',
    client: { marche: 'Marché A', commissione: 'Commission 1' },
    debiteur: 'Ali',
    montant: '1500 DH',
    date: '2025-08-01',
    typeReglement: 'Espèces',
    modeReglement: 'Virement',
    gestionnaire: { nom: 'Ghita' },
    responsable: 'Yassine'
  },
  {
    id_recu: 2,
    dossierInterne: 'INT-002',
    dossierExterne: 'EXT-123',
    client: { marche: 'Marché A', commissione: 'Commission 1' },
    debiteur: 'AYMEN',
    montant: '1500 DH',
    date: '2025-04-21',
    typeReglement: 'Espèces',
    modeReglement: 'Virement',
    gestionnaire: { nom: 'NABIL' },
    responsable: 'GHITA'
  },
  {
    id_recu: 3,
    dossierInterne: 'INT-003',
    dossierExterne: 'EXT-123',
    client: { marche: 'Marché A', commissione: 'Commission 1' },
    debiteur: 'Ali',
    montant: '1500 DH',
    date: '2025-08-01',
    typeReglement: 'Espèces',
    modeReglement: 'Virement',
    gestionnaire: { nom: 'AYMEN' },
    responsable: 'IMANE'
  },
];

// état initial des filtres
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

export default function MesEncaissements() {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState(initialFilters);

  // mise à jour d'un filtre
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  // remise à zéro de données et filtres
  const handleRefresh = () => {
    setData(initialData);
    setFilters(initialFilters);
  };

  // export des données filtrées en Excel
  const exportToExcel = () => {
    const exportData = filteredData.map(row => ({
      'Id reçu': row.id_recu,
      'Dossier interne': row.dossierInterne,
      'Dossier externe': row.dossierExterne,
      'Marché': row.client.marche,
      'Commission': row.client.commissione,
      'Débiteur': row.debiteur,
      'Montant': row.montant,
      'Date': row.date,
      'Type règlement': row.typeReglement,
      'Mode règlement': row.modeReglement,
      'Gestionnaire': row.gestionnaire.nom,
      'Responsable': row.responsable
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Encaissements');
    XLSX.writeFile(wb, 'encaissements.xlsx');
  };

  // données filtrées
  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (filters.dossierInterne && !row.dossierInterne.includes(filters.dossierInterne)) return false;
      if (filters.dossierExterne && !row.dossierExterne.includes(filters.dossierExterne)) return false;
      if (filters.client && row.client.marche !== filters.client) return false;
      if (filters.debiteur && !row.debiteur.toLowerCase().includes(filters.debiteur.toLowerCase())) return false;
      if (filters.minMontant && parseFloat(row.montant) < parseFloat(filters.minMontant)) return false;
      if (filters.maxMontant && parseFloat(row.montant) > parseFloat(filters.maxMontant)) return false;
      if (filters.dateFrom && row.date < filters.dateFrom) return false;
      if (filters.dateTo && row.date > filters.dateTo) return false;
      if (filters.typeReglement && row.typeReglement !== filters.typeReglement) return false;
      if (filters.modeReglement && row.modeReglement !== filters.modeReglement) return false;
      if (filters.responsable && row.responsable !== filters.responsable) return false;
      return true;
    });
  }, [data, filters]);

  // indicateurs
  const totalAmount = useMemo(() => {
    return filteredData
      .reduce((sum, row) => sum + parseFloat(row.montant.replace(/\s*DH/, '')), 0)
      .toFixed(2);
  }, [filteredData]);
  const count = filteredData.length;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: '1rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        margin: '0 auto',
        marginTop: '-1rem',
      }}
    >
      {/* Entête */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Liste des encaissements</h2>
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 'bold' }}>
          <div>{totalAmount} MAD</div>
          <div>{count} encaissement{count > 1 ? 's' : ''}</div>
        </div>
        <button
          onClick={exportToExcel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.5rem 1rem',
            border: 'none',
            backgroundColor: '#036d5bff',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: 'auto',
            marginTop: '-2.5rem'
          }}
        >
          <FaFileExcel /> Excel
        </button>
      </div>

      {/* Contenu principal */}
      <div style={{ display: 'flex', flex: 1, gap: '1rem', overflow: 'hidden' }}>
        {/* Sidebar filtres */}
        <div
          style={{
            width: '200px',
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '4px',
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.91)',
            overflowY: 'auto'
          }}
        >
          {/* Dossier interne */}
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              placeholder="Id dossier interne"
              type="text"
              name="dossierInterne"
              value={filters.dossierInterne}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem' }}
            />
          </label>
          {/* Dossier externe */}
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              placeholder="Id dossier externe"
              type="text"
              name="dossierExterne"
              value={filters.dossierExterne}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem' }}
            />
          </label>
          {/* Client */}
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <select
              name="client"
              value={filters.client}
              onChange={handleFilterChange}
              style={{ width: '106%', padding: '0.25rem', marginTop: '0.25rem' }}
            >
              <option value="">client</option>
              {Array.from(new Set(data.map(r => r.client.marche))).map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
          </label>
          {/* Débiteur */}
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              placeholder="Nom débiteur"
              type="text"
              name="debiteur"
              value={filters.debiteur}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem' }}
            />
          </label>
          {/* Montant min/max */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <input
                placeholder="Montant min"
                type="number"
                name="minMontant"
                value={filters.minMontant}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                placeholder="Montant max"
                type="number"
                name="maxMontant"
                value={filters.maxMontant}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem' }}
              />
            </div>
          </div>
          {/* Date From / To */}
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              placeholder="Date de début"
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.2rem', marginTop: '0.25rem' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              placeholder="Date de fin"
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.25rem', marginTop: '0.25rem' }}
            />
          </label>
          {/* Type de règlement */}
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <select
              name="typeReglement"
              value={filters.typeReglement}
              onChange={handleFilterChange}
              style={{ width: '106%', padding: '0.25rem', marginTop: '0.25rem' }}
            >
              <option value="">Type de règlement</option>
              <option value="Espèces">Espèces</option>
              <option value="Chèque">Chèque</option>
            </select>
          </label>
          {/* Mode de règlement */}
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <select
              name="modeReglement"
              value={filters.modeReglement}
              onChange={handleFilterChange}
              style={{ width: '106%', padding: '0.25rem', marginTop: '0.25rem' }}
            >
              <option value="">Mode de règlement</option>
              <option value="Virement">Virement</option>
              <option value="Tip">Tip</option>
            </select>
          </label>
          {/* Responsable */}
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <select
              name="responsable"
              value={filters.responsable}
              onChange={handleFilterChange}
              style={{ width: '106%', padding: '0.25rem', marginTop: '0.25rem' }}
            > 
              <option value="">Responsable</option>
              {Array.from(new Set(data.map(r => r.responsable))).map((n, i) => (
                <option key={i} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Zone tableau */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '1px',
            boxShadow: '0 0 5px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',  // ← scrollbar activée
            marginRight: '-8.5rem',
          }}
        >
          {/* Vide si pas d'actions */}
          <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }} />

          {/* Tableau scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', marginTop: '0.5rem', padding: '0.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#cbb7b7ff', color: 'white' }}>
                <tr>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>ID reçu</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Dossier Int.</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Dossier Ext.</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Marché</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Commission</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Débiteur</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Montant</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Type</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Mode</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Gestionnaire</th>
                  <th style={{ padding: '0.25rem', border: '1px solid #ddd' }}>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.id_recu}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.dossierInterne}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.dossierExterne}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.client.marche}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.client.commissione}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.debiteur}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.montant}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.date}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.typeReglement}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.modeReglement}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.gestionnaire.nom}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #eee' }}>{row.responsable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}