import React, { useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import axios from "axios";
import { LiaOtterSolid } from "react-icons/lia";

const FiltrageGDebiteur = ({
  debiteurFilter,
  setDebiteurFilter,
  intervenantFilter,
  setIntervenantFilter,
  dossierInterneFilter,
  setDossierInterneFilter,
  dossierExterneFilter,
  setDossierExterneFilter,
  handleResetFilters,
  lotFilter,
  setLotFilter,
  statusFilter,
  setStatusFilter,
  clientFilter,
  setClientFilter,
  teleFilter,
  setTeleFilter,
  setFamilleFilter,
  familleFilter,
  actionFilter,
  minDate,
  setMinDate,
  maxDate,
  setMaxDate,
  setActionFilter
}) => {
  const inputStyle = {
    padding: "0.5rem",
    border: "1px solid #cbd5e1",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    width: "100%",
    boxSizing: "border-box",
  };

  const inputDateStyle = {
    flex: 1,
    padding: "0.25rem 0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
  };

  const selectStyle = {
    padding: "0.5rem",
    height: "2rem",
    border: "1px solid #cbd5e1",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    backgroundColor: "#fff",
    color: "#1f2937",
    appearance: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const [lot, setLots] = useState([]);
  const [status, setStatus] = useState([]);
  const [client, setClient] = useState([]);
  const [famille, setFamille] = useState([]);
  const [actions, setActions] = useState([]);
  const [familleId,setFamilleId] = useState()
    const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  useEffect(() => {
    const fetchLot = async () => {
      try {
        const res = await axios.get(`http://${HOST}:${PORT}/parametrage/lots`);
        setLots(res.data.filter((stat) => stat.visibility === 1));
        console.log(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://${HOST}:${PORT}/parametrage/status`);
        setStatus(res.data.filter((stat) => stat.visibility === 1));
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchClient = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/parametrage/clients`
        );
        setClient(res.data.filter((stat) => stat.visibility === 1));
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchActions = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/parametrage/actions`
        );
        
        setActions(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchFamille = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/action/getFamillesAction`
        );
        setFamille(res.data.filter((stat) => stat.visibility === 1));
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchFamille();
    fetchLot();
    fetchStatus();
    fetchClient();
    fetchActions();
  }, []);

  return (
    <aside
      style={{
        width: "20%",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
      }}
    >
      Type d'action
      <select
        style={selectStyle}
        value={familleFilter}
        onChange={(e) => setFamilleFilter(e.target.value)}
      >
        <option value="" style={{ color: "#cccac4" }}>
          Type d'action
        </option>
        {famille.map((item, index) => (
          <option key={index} value={item.familleAction}>
            {item.familleAction}
          </option>
        ))}
      </select>

      {/* Actions */}
      <select
        style={selectStyle}
        defaultValue=""
        value={actionFilter}
        onChange={(e) => (setActionFilter(e.target.value))}
      >
        <option value="" disabled>
          Actions
        </option>
        {actions.map((item, index) => (
          <option key={index} value={item.nomAction}>
            {item.nomAction}
          </option>
        ))}
      </select>

      {/* Réalisée */}
      <select style={selectStyle} defaultValue="">
        <option value="" disabled>
          Réalisée
        </option>
        <option value="Réalisée 1">Réalisée 1</option>
        <option value="Réalisée 2">Réalisée 2</option>
      </select>

      {/* Client */}
      <select
        style={selectStyle}
        value={clientFilter}
        onChange={(e) => setClientFilter(Number(e.target.value))}
      >
        <option style={{ color: "#cccac4" }}>Client</option>
        {client.map((item, index) => (
          <option key={index} value={item.id}>
            {item.marche}
          </option>
        ))}
      </select>

      {/* Lot */}
      <select
        style={selectStyle}
        value={lotFilter}
        onChange={(e) => setLotFilter(Number(e.target.value))}
      >
        <option style={{ color: "#cccac4" }}>Lot</option>
        {lot.map((item, index) => (
          <option key={index} value={item.id}>
            {item.Nlot}
          </option>
        ))}
      </select>

      {/* Statut */}
      <select
        style={selectStyle}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Statut</option>
        {status.map((item, index) => (
          <option key={index} value={item.statusValue}>
            {item.statusValue}
          </option>
        ))}
      </select>

      {/* Numero de tél */}
      <input
        type="text"
        placeholder="Numéro de tél"
        value={teleFilter}
        onChange={(e) => setTeleFilter(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Intitulé débiteur"
        value={debiteurFilter}
        onChange={(e) => setDebiteurFilter(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Numéro de pièce"
        value={intervenantFilter}
        onChange={(e) => setIntervenantFilter(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="N° de dossier interne"
        value={dossierInterneFilter}
        onChange={(e) => setDossierInterneFilter(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="N° de dossier externe"
        value={dossierExterneFilter}
        onChange={(e) => setDossierExterneFilter(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="date"
          value={minDate}
          onChange={(e) => setMinDate(e.target.value)}
          style={inputDateStyle}
        />
        <span style={{ fontSize: "0.75rem" }}>à</span>
        <input
          type="date"
          value={maxDate}
          onChange={(e) => setMaxDate(e.target.value)}
          style={inputDateStyle}
        />
      </div>

      <button
        onClick={handleResetFilters}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem",
          backgroundColor: "#f87171",
          color: "#fff",
          border: "none",
          borderRadius: "0.25rem",
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: "background-color 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#ef4444")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f87171")}
      >
        <FaRedo />
        Réinitialiser les filtres
      </button>
    </aside>
  );
};

export default FiltrageGDebiteur;
