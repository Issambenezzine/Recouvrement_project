import React, { useState, useEffect } from "react";
import axios from "axios";
import GestionDossier from "./gestion_dossier";
const DetailDossier = ({ dossier, actions = [], debiteur, AllDossiers, data, switchDossier }) => {
  const [dossiers, setDossiers] = useState([]);
  const [showDossier, setShowDossier] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/dossier/dossiers?cin=${dossier.debiteurInfo?.debiteur?.CIN}`
        );
        setDossiers(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchDossiers();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.infoSection}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={styles.title}>{dossier.debiteurInfo.debiteur.nom}</h2>
          {debiteur && (localStorage.getItem("Role") === "ADMIN" || localStorage.getItem("Role") === "VISITEUR") && (
            <div
              style={{ display: "flex", width: "40%", justifyContent: "right" }}
            >
              {dossiers.map((d, index) => (
                <div
                  key={index}
                  style={{
                    color: "white",
                    backgroundColor:
                      d.id === dossier.dossier.id
                        ? "#85443eff"
                        : "#85443e58",
                    width: "fit-content",
                    padding: "7px",
                    marginRight: "7px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    switchDossier(AllDossiers.filter(result => result.dossier.NDossier === d.NDossier && result.dossier.clientId === d.clientId)[0]);
                  }}
                >
                  dossier : {d.NDossier}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.grid}>
          {[
            ["Client", dossier.client.marche || "-"],
            ["N° dossier", dossier.dossier.NDossier || "-"],
            ["Responsable", dossier.manager || "-"],
            ["N° lot", dossier.dossier.lotId || "-"],
            ["Gestionnaire", dossier.gestionnaire || "-"],
            ["Type de lot", dossier.dossier.type || "-"],
            ["Téléphone 1", dossier.debiteurInfo.debiteur.debiteur_tel1 || "-"],
            ["Téléphone 2", dossier.debiteurInfo.debiteur.debiteur_tel2 || "-"],
            ["Créance", dossier.creance.creance || "-"],
            ["Frais divers", dossier.creance.autreFrais || "-"],
            ["Intérêts de retard", dossier.creance.intRetard],
            [
              "Total à régler initial",
              dossier.creance.creance,
            ],
            [
              "Total à régler",
              dossier.creance.creance + dossier.creance.autreFrais  + dossier.creance.intRetard|| "-",
            ],
            ["Encaissés", dossier.dossier.encaisse],
            ["Capital", dossier.creance.capital || "-"],
            ["Solde", dossier.creance.solde || "-"],
          ].map(([label, value], index) => (
            <div key={index}>
              <strong style={styles.label}>{label}:</strong>
              <div style={styles.input}>{value}</div>
            </div>
          ))}
        </div>
      </div>
      {showDossier && selectedClient && (
        <GestionDossier
          client={selectedClient}
          onClose={() => setShowDossier(false)}
          dossiers={data}
          debiteur={debiteur}
        />
      )}
    </div>
  );
};

/* === STYLES === */
const styles = {
  container: {
    display: "flex",
    gap: "1rem",
    padding: "0.8rem",
    fontFamily: "Segoe UI, sans-serif",
    color: "#333",
  },
  timelineSection: {
    flex: "0 0 220px",
    padding: "1rem",
    backgroundColor: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "8px",
    height: "100%",
    overflowY: "auto",
  },
  infoSection: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    marginBottom: "0.8rem",
    fontSize: "1.7rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0.7rem",
    backgroundColor: "#f4f4f4",
    padding: "1rem",
    borderRadius: "8px",
  },
  label: {
    fontSize: "0.85rem",
  },
  input: {
    marginTop: "3px",
    padding: "6px 10px",
    backgroundColor: "#eee",
    borderRadius: "4px",
    fontWeight: "500",
    fontSize: "0.85rem",
  },
};

export default DetailDossier;
