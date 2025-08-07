import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEye, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function G_Dossier() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const verifyUser = async () => {
    try {
      const res = await axios.get(`http://localhost:3004/auth/admin`, {
        withCredentials: true,
      });
    } catch (err) {
      navigate("/");
    }
  };

  const fetchGestionDossier = async () => {
    try {
      const res = await axios.get("http://localhost:3004/admin/getGesionDossier", {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    verifyUser();
    fetchGestionDossier();
  }, []);

  return (
    <div style={{ padding: '2rem', marginTop: '-40px' }}>
      {/* Barre de recherche */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.5rem', marginLeft: '800px'
      }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <FaSearch style={{
            position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)',
            color: '#888'
          }} />
          <input
            type="text"
            placeholder="Rechercher un gestionnaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 10px 10px 35px',
              borderRadius: '24px', border: '1px solid #ccc',
              fontSize: '14px', backgroundColor: '#c4c5c7c3'
            }}
          />
        </div>
      </div>

      {/* Grille des tableaux */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem'
      }}>
        {data.map((row, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e9cfcf', color: 'black' }}>
                  <th style={{ padding: '8px', width: '40px' }}><FaUserCircle size={20} /></th>
                  <th style={{ padding: '3px', textAlign: 'left', fontWeight: "bold" }}>{row.manager}</th>
                  <th style={{ padding: '3px', textAlign: 'center' }}>Nb dossiers</th>
                  <th style={{ padding: '3px', textAlign: 'center' }}>Créances totales</th>
                  <th style={{ padding: '8px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {row.stats
                  .filter((g) => g.Gestionnaire.toLowerCase().includes(search.toLowerCase()))
                  .map((g, i) => {
                    console.log("▶️ GESTIONNAIRE:", g);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '8px', textAlign: 'center' }}><FaUserCircle /></td>
                        <td style={{ padding: '8px' }}>{g.Gestionnaire}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{g.dossiers}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{g.TOTAL} MAD</td>
                        <td style={{ padding: '8px', textAlign: 'center', cursor: 'pointer' }}>
                        {g.Gestionnaire ? (
                          <FaEye
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              // Stocker le nom du gestionnaire dans le localStorage
                              localStorage.setItem('selectedGestionnaireName', g.Gestionnaire);
                              // Naviguer vers la page du gestionnaire
                              navigate(`/admin/gestionnaire/${encodeURIComponent(g.Gestionnaire)}`);
                            }}
                          />
                        ) : (
                          <span style={{ color: '#aaa' }}>—</span>
                        )}

                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
