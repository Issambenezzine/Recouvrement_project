import axios from "axios";
import React, { useEffect } from "react";

export default function Patrimoine({ dossier }) {
  const debiteur = dossier?.debiteurInfo || {};
  const [patrimoinsCadrage, setPtrimoinsCadrage] = React.useState([]);
    const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  useEffect(() => {
    const fetchPatrimoinsCadrages = async () => {
      try {
        const res = await axios.post(
          `http://${HOST}:${PORT}/patrimoin/get`,
          {
            debiteurId: dossier.dossier.debiteurId,
            marche: dossier.dossier.clientId,
          },
          {
            withCredentials: true,
          }
        );
        setPtrimoinsCadrage(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchPatrimoinsCadrages();
  },[]);

  return (
    <div style={containerStyle}>
      <h3 style={{ ...titleStyle, marginTop: "2rem", fontSize: "1.1rem" }}>
        Gestion des patrimoines
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>N°</th>
            <th> Conservation</th>
            <th>Titre Foncier</th>
            <th>Nombre de tire identifiés</th>
            <th> Source</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style={tbodyRowStyle}>
            <td>{debiteur.id || "..."}</td>
            <td>{debiteur.conservation || "..."}</td>
            <td>{debiteur.titreFoncier || "..."}</td>
            <td>{debiteur.nombreTireIdentifiés || "..."}</td>
            <td>{debiteur.source || "..."}</td>
            <td>{debiteur.statut || "..."}</td>
            <td>{debiteur.action || "..."}</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ ...titleStyle, marginTop: "4rem", fontSize: "1.1rem" }}>
        Autre
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th>Ville</th>
            <th>titre</th>
            <th>NBRE_TF</th>
            <th>Nom</th>
            <th>NomF</th>
            <th>H</th>
            <th>Are</th>
            <th>CA</th>
            <th>Quote</th>
            <th>Part</th>
            <th>Pdite</th>
            <th>AdrProp</th>
            <th>Consistance</th>
          </tr>
        </thead>
        <tbody>
          {patrimoinsCadrage.map((patrimoin,index) =>(
            <tr style={tbodyRowStyle} key={index}>
              <td>{patrimoin.id}</td>
              <td>{patrimoin.ville}</td>
              <td>{patrimoin.titre}</td>
              <td>{patrimoin.NBRE_TF}</td>
              <td>{patrimoin.Nom}</td>
              <td>{patrimoin.NomF}</td>
              <td>{patrimoin.H}</td>
              <td>{patrimoin.Are}</td>
              <td>{patrimoin.CA}</td>
              <td>{patrimoin.Quote}</td>
              <td>{patrimoin.Part}</td>
              <td>{patrimoin.Pdite}</td>
              <td>{patrimoin.AdrProp}</td>
              <td>{patrimoin.Consistance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styles
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

const formContainerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1.5fr",
  rowGap: "0.8rem",
  columnGap: "1rem",
  fontSize: "0.95rem",
};

const rowStyle = {
  display: "contents",
};

const labelStyle = {
  fontWeight: "500",
  alignSelf: "center",
  color: "#333",
};

const inputStyle = {
  backgroundColor: "#eee",
  padding: "0.6rem 1rem",
  borderRadius: "4px",
  minHeight: "2.2rem",
  display: "flex",
  alignItems: "center",
  wordBreak: "break-word",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "1rem",
  fontSize: "0.9rem",
};

const theadStyle = {
  backgroundColor: "#e3e3e3",
  textAlign: "center",
  fontWeight: "bold",
};

const tbodyRowStyle = {
  textAlign: "center",
  backgroundColor: "#fff",
  borderTop: "1px solid #ccc",
};
