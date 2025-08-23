import React,{useState,useEffect} from 'react';
import axios from 'axios';
export default function Adresse({ dossier }) {

  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;

  const [adresse, setAdresse] = useState([]);
  
    useEffect(() => {
      const fetchAdresse = async () => {
        try {
          const res = await axios.post(
            `http://${HOST}:${PORT}/debiteur/adresse`,
            {debiteurId: dossier.dossier.debiteurId, marche: dossier.dossier.clientId},
            { withCredentials: true }
          );
          console.log(res.data)
          setAdresse(res.data);
        } catch (err) {
          console.log(err.message);
        }
      };
      fetchAdresse();
    }, []);

  return (
    <div style={containerStyle}>
      <h3 style={{ ...titleStyle, marginTop: '2rem', fontSize: '1.1rem' }}>Informations intervenant / cautionneur</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th>Nom et Prénom</th>
            <th>Adresse</th>
            <th>CIN</th>
            <th>Ville</th>
          </tr>
        </thead>
        <tbody>
          {adresse.map((ad,index) => (
          <tr key={index} style={tbodyRowStyle}>
            <td>{ad.id || '—'}</td>
            <td>{dossier.debiteurInfo.debiteur.nom || '—'}</td>
            <td>{ad.addresseDebiteur || '—'}</td>
            <td>{dossier.debiteurInfo.debiteur.CIN || '—'}</td>
            <td>{ad.ville || '—'}</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}
const containerStyle = {
  padding: '1rem',
  fontFamily: 'Segoe UI, sans-serif',
  maxWidth: '900px',
  margin: '0 auto'
};

const titleStyle = {
  marginBottom: '1rem',
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#4b0101',
  textAlign: 'left'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
  fontSize: '0.9rem',
  border: '1px solid #ccc'
};

const theadStyle = {
  backgroundColor: '#e3e3e3',
  textAlign: 'center',
  fontWeight: 'bold'
};

const tbodyRowStyle = {
  textAlign: 'center',
  backgroundColor: '#fff',
  borderTop: '1px solid #ccc'
};