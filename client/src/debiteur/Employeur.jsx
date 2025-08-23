import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Employeur({ dossier }) {
  const [employeurs, setEmployeur] = useState([]);
  const [employeursCadrage,setEmployeurCadrage] = useState([]);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;

  useEffect(() => {
    const fetchEmployeur = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/employeur/get/${dossier.debiteurInfo.debiteur.CIN}`,
          { withCredentials: true }
        );
        setEmployeur(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    const fatchEmployeurCadrage = async () => {
      try {
        const res = await axios.post(`http://${HOST}:${PORT}/employeur/getCadrage`,
          {
            debiteurId: dossier.dossier.debiteurId,
            marche: dossier.dossier.clientId
          },
          {
            withCredentials:true
          }
        )
        setEmployeurCadrage(res.data);
      }catch(err) {
        console.log(err.message);
      }
    }
    fatchEmployeurCadrage();
    fetchEmployeur();
  }, []);

  return (
    <div style={containerStyle}>
      {/* Partie employeur dans un tableau */}
      <h3 style={{ ...titleStyle, marginTop: "2rem", fontSize: "1.1rem" }}>
        Informations de l’employeur
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th>Nom et Prénom</th>
            <th>Employeur adresse</th>
            <th>Employeur ville</th>
            <th>N°Téléphone1</th>
            <th>N°Téléphone2</th>
          </tr>
        </thead>
        <tbody>
          {employeurs.map((employeur, index) => (
            <tr key={index} style={tbodyRowStyle}>
              <td>{employeur.id || '—'}</td>
              <td>{employeur.employeur || '—'}</td>
              <td>{employeur.addresse || '—'}</td>
              <td>{employeur.ville || '—'}</td>
              <td>{employeur.employeur_tel1 || '—'}</td>
              <td>{employeur.employeur_tel2 || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ ...titleStyle, marginTop: "4rem", fontSize: "1.1rem" }}>
        Autre
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th>RS</th>
            <th>AVT</th>
            <th>AD_STE</th>
            <th>V_STE</th>
            <th>NUM_SAL</th>
            <th>NM</th>
            <th>PR</th>
            <th>AD_SAL</th>
            <th>V_SAL</th>
            <th>PRD</th>
            <th>JR</th>
            <th>SLR</th>
            <th>ML</th>
            <th>TL</th>
          </tr>
        </thead>
        <tbody>
         {employeursCadrage.map((employeur, index) =>(
          <tr key={index} style={tbodyRowStyle}>
            <td>{employeur.id || '—'}</td>
            <td>{employeur.RS || '—'}</td>
            <td>{employeur.AVT || '—'}</td>
            <td>{employeur.AD_STE || '—'}</td>
            <td>{employeur.V_STE || '—'}</td>
            <td>{employeur.NUM_SAL || '—'}</td>
            <td>{employeur.NM || '—'}</td>
            <td>{employeur.PR || '—'}</td>
            <td>{employeur.AD_SAL || '—'}</td>
            <td>{employeur.V_SAL || '—'}</td>
            <td>{employeur.PRD || '—'}</td>
            <td>{employeur.JR || '—'}</td>
            <td>{employeur.SLR || '—'}</td>
            <td>{employeur.ML || '—'}</td>
            <td>{employeur.TL || '—'}</td>
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
