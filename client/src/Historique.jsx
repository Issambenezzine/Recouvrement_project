import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";

export default function Historique({id}) {
  const [historiques, setHistorique] = useState([]);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/historique/get/${id}`,
          {
            withCredentials: true,
          }
        );
        setHistorique(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistorique();
  }, []);

  return (
    <div style={containerStyle}>
      <h3 style={{ ...titleStyle, marginTop: "2rem", fontSize: "1.1rem" }}>
        Historique de cadrage
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th>ID Débiteur</th>
            <th>Nature de cadrage</th>
            <th>Date de la demande</th>
            <th>Date de la retour</th>
            <th>Date de confirmation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody style={tbodyRowStyle}>
            {historiques.map((h,index) => (
              <tr key={index}>
                <td>{h.id}</td>
                <td>{h.debiteur_ID}</td>
                <td>{h.nature}</td>
                <td>{h.date_demande == null ? "__" : moment(h.date_demande)?.format("DD/MM/YYYY")}</td>
                <td>{h.date_retour == null ? "__" : moment(h.date_retour)?.format("DD/MM/YYYY")}</td>
                <td>{h.date_confirmation == null ? "__" : moment(h.date_confirmation)?.format("DD/MM/YYYY")}</td>
                <td>{h.status}</td>
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
  maxWidth: "1000px",
  margin: "0 auto",
};

const titleStyle = {
  marginBottom: "1rem",
  fontSize: "1.3rem",
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
