import React,{useState,useEffect} from 'react';
import axios from 'axios';
export default function Intervenant({ dossier }) {
      const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;

  const [cautionneurs, setCautioneur] = useState([]);
  
    useEffect(() => {
      const fetchCautioneur = async () => {
        try {
          const res = await axios.get(
            `http://${HOST}:${PORT}/cautionneur/get/${dossier.debiteurInfo.debiteur.CIN}`,
            { withCredentials: true }
          );
          setCautioneur(res.data);
        } catch (err) {
          console.log(err.message);
        }
      };
      fetchCautioneur();
    }, []);

  return (
    <div style={containerStyle}>
      <h3 style={{ ...titleStyle, marginTop: '2rem', fontSize: '1.1rem' }}>Informations intervenant / cautionneur</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th>ID</th>
            <th>N°CIN</th>
            <th>Nom et prénom</th>
            <th>Intervenant adresse</th>
            <th>Intervenant ville</th>
            <th>N°Téléphone1</th>
            <th>N°Téléphone2</th>
          </tr>
        </thead>
        <tbody>
          {cautionneurs.map((intervenant,index) => (
          <tr key={index} style={tbodyRowStyle}>
            <td>{intervenant.id || '—'}</td>
            <td>{intervenant.CIN || '—'}</td>
            <td>{intervenant.nom || '—'}</td>
            <td>{intervenant.addresse || '—'}</td>
            <td>{intervenant.ville || '—'}</td>
            <td>{intervenant.cautionneurTel1 || '—'}</td>
            <td>{intervenant.cautionneurTel2 || '—'}</td>
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