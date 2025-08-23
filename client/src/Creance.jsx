import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";

export default function Creance({ dossier }) {
  const [banque, setBanque] = useState([]);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  useEffect(() => {
    const fetchBanques = async () => {
      try {
        const res = await axios.post(
          `http://${HOST}:${PORT}/banque/get`,
          {
            debiteurId:dossier.dossier.debiteurId,
            marche: dossier.dossier.clientId,
          },
          {
            withCredentials: true,
          }
        );
        setBanque(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanques();
  }, []);

  return (
    <div style={containerStyle}>
      <h3 style={{ ...titleStyle, marginTop: "2rem", fontSize: "1.1rem" }}>
        Créances
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID interne</th>
            <th>Gestionnaire</th>
            <th>Client</th>
            <th>Catégorie dossier</th>
            <th>Capital</th>
            <th>Créance</th>
            <th>Intérêt de retard</th>
            <th>Frais divers</th>
            <th>Total créance</th> 
            <th>durée</th>
            <th>mensualité</th>
            <th>Date première échéance</th> 
            <th>Date dernière échéance</th> 
            <th>Date contentieux</th>
          </tr>
        </thead>
        <tbody style={tbodyRowStyle}>
            <tr>
              <td>{dossier.creance.id}</td>
              <td>{dossier.gestionnaire}</td>
              <td>{dossier.client.marche}</td>
              <td>{dossier.dossier.categorie}</td>
              <td>{dossier.creance.capital}</td>
              <td>{dossier.creance.creance}</td>
              <td>{dossier.creance.intRetard}</td>
              <td>{dossier.creance.autreFrais}</td>
              <td>{Number(dossier.creance.creance) + Number(dossier.creance.autreFrais) + Number(dossier.creance.intRetard)}</td>
              <td>{dossier.creance.duree}</td>
              <td>{dossier.creance.mensualite}</td>
              <td>{moment(dossier.creance.date1Echeance).format("DD/MM/YYYY")}</td>
              <td>{moment(dossier.creance.dateDEcheance).format("DD/MM/YYYY")}</td>
              <td>{moment(dossier.creance.dateContentieux).format("DD/MM/YYYY")}</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}

// ================= STYLES =================
const containerStyle = {
  padding: "1rem",
  fontFamily: "Segoe UI, sans-serif",
  maxWidth: "1000px",
  margin: "0 auto",
};

const titleStyle = {
  marginBottom: "1rem",
  fontSize: "1.2rem",
  fontWeight: "600",
  color: "#4b0101",
  textAlign: "left",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "1rem",
  fontSize: "0.8rem",
  border: "1px solid #ccc",
};

const theadStyle = {
  backgroundColor: "#e3e3e3",
  // textAlign: "center",
  fontWeight: "bold",
};

const tbodyRowStyle = {
  textAlign: "center",
  backgroundColor: "#fff",
  borderTop: "1px solid #ccc",
};
