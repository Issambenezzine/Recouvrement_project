import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";

export default function Banque({ dossier }) {
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
        Informations banque
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th>Débiteur</th>
            <th>solde</th>
            <th>Tel_Domicile</th>
            <th>RIB</th>
            <th>Date</th>
            <th>Date_mouvement</th>
          </tr>
        </thead>
        <tbody style={tbodyRowStyle}>
          {banque.map((b, index) => (
            <tr key={index}>
              <td>{b.id}</td>
              <td>{b.nom}</td>
              <td>{b.solde}</td>
              <td>{b.Tel_Domicile}</td>
              <td>{b.RIB}</td>
              <td>{moment(b.Date).format("DD/MM/YYYY")}</td>
              <td>{moment(b.Date_mouvement).format("DD/MM/YYYY")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ================= STYLES =================
const containerStyle = {
  padding: "1rem",
  fontFamily: "Segoe UI, sans-serif",
  maxWidth: "900px",
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
  fontSize: "0.9rem",
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
