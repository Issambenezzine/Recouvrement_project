import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './P_Commission.css';

const P_Commission = () => {
  // États pour les filtres
  const [selectedManager, setSelectedManager] = useState('Tous');
  const [selectedMonth, setSelectedMonth] = useState('Tous');

  // Données de synthèse
  const summary = [
    { label: "Nombre total d'interventions", value: 128},
    { label: 'Total des créances en cours', value: 2450000, suffix: ' DH' },
    { label: 'Montant encaissé', value: 1805000, suffix: ' DH' },
    { label: 'Retards cumulés', value: 320000, suffix: ' DH' },
    { label: 'Taux de recouvrement global', value: 73.7, suffix: ' %' },
    { label: 'Moyenne de traitement par gestionnaire', value: 21 },
  ];

  // Options des filtres
  const managers = [
    'Tous',
    'IMANE',
    'GHITA',
    'KHALID',
  ];
  const months = [
    'Tous',
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  // Tableau principal
  const tableData = [
    {
      id: 1,
      nom: 'IMANE',
      encaissement: 75000000,
      commission: 8170880,
      objectif: 35000000,
      taux: 47,
      reliquat: 0,
    },
    {
      id: 2,
      nom: 'GHITA',
      encaissement: 52000000,
      commission: 5200000,
      objectif: 30000000,
      taux: 38,
      reliquat: 0,
    },
    {
      id: 3,
      nom: 'KHALID',
      encaissement: 19000000,
      commission: 1900000,
      objectif: 15000000,
      taux: 13,
      reliquat: 0,
    },
  ];

  // Données de chart mensuelles et quotidiennes
  const monthlyEncaissement = [
    { month: 'Jan', value: 40000 },
    { month: 'Fév', value: 45000 },
    { month: 'Mar', value: 50000 },
    { month: 'Avr', value: 55000 },
    { month: 'Mai', value: 60000 },
    { month: 'Juin', value: 65000 },
    { month: 'Juil', value: 70000 },
  ];
  const dailyEncaissement = [
    { date: '04/07', value: 7000 },
    { date: '05/07', value: 8000 },
    { date: '06/07', value: 7800 },
    { date: '07/07', value: 8200 },
    { date: '08/07', value: 8600 },
    { date: '09/07', value: 9000 },
    { date: '10/07', value: 8800 },
  ];
  const monthlyCommission = monthlyEncaissement.map((d) => ({
    month: d.month,
    value: Math.round(d.value * 0.1),
  }));
  const dailyCommission = dailyEncaissement.map((d) => ({
    date: d.date,
    value: Math.round(d.value * 0.1),
  }));

  // Données de performance (encaissement vs objectif en M€)
  const performanceData = tableData.map((d) => ({
    name: d.nom,
    réel: Math.round(d.encaissement / 1e6),
    objectif: Math.round(d.objectif / 1e6),
  }));

 

  return (
    <div className="p-commission-page">
      {/* Cartes de synthèse */}
      <div className="stats-container">
        {summary.map((item) => (
          <div key={item.label} className="stats-card">
            <h3>{item.label}</h3>
            <p>
              {new Intl.NumberFormat('fr-FR').format(item.value)}
              {item.suffix || ''}
            </p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="controls">
        <div>
          <label>GESTIONNAIRE</label>
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
          >
            {managers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>MOIS</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau et bouton Actualiser */}
      <div className="table-header">
        <h2>Tableau de suivi des encaissements</h2>
        
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Nom et Prénom</th>
              <th>Encaissement N</th>
              <th>Commission N</th>
              <th>Objectif</th>
              <th>Taux (%)</th>
              <th>Reliquat</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.nom}</td>
                <td>
                  {new Intl.NumberFormat('fr-FR').format(row.encaissement)} DH
                </td>
                <td>
                  {new Intl.NumberFormat('fr-FR').format(row.commission)} DH
                </td>
                <td>
                  {new Intl.NumberFormat('fr-FR').format(row.objectif)} DH
                </td>
                <td>{row.taux} %</td>
                <td>
                  {row.reliquat === 0 ? (
                    <span className="reliquat-zero">0,00 DH</span>
                  ) : (
                    <span className="reliquat-positive">
                      {new Intl.NumberFormat('fr-FR').format(row.reliquat)} DH
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section Charts */}
      <div className="charts-container">
        {/* Encaissement */}
        <div className="chart-card">
          <h4>Encaissement</h4>
          <p>Total mensuel : 389 000 DH</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyEncaissement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#006A71" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={dailyEncaissement}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#006A71" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-footer">Total quotidien : 7 800 DH</p>
        </div>

        {/* Commission */}
        <div className="chart-card">
          <h4>Commission</h4>
          <p>Total mensuel : 38 900 DH</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyCommission}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF8C00" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={dailyCommission}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FF8C00"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-footer">Total quotidien : 3 890 DH</p>
        </div>

        {/* Performance */}
        <div className="chart-card">
          <h4>Suivi de la performance des gestionnaires</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="réel" name="Réel (M€)" fill="#006A71" />
              <Bar dataKey="objectif" name="Objectif (M€)" fill="#FF8C00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default P_Commission;
