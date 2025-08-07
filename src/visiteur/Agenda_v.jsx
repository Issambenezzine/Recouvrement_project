import React, { useEffect, useState, useRef } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import StatCards from "../Carde";
import GestionDossier from "../gestion_dossier";
import Filtrage from "../Filtrage";
import { useNavigate } from "react-router-dom";
// import {useSocketDossiersAgenda} from "./hooks/socketHook.js"
import { io } from "socket.io-client";
import axios from "axios";

// Styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f7fa',
    minHeight: 'calc(100vh - 120px)',
    fontFamily: 'Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  },
  cardActive: {
    borderLeft: '4px solid #4caf50',
  },
  cardTitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 8px 0',
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: '12px 16px',
    textAlign: 'left',
    color: '#6c757d',
    fontWeight: '600',
    fontSize: '14px',
    borderBottom: '1px solid #e9ecef',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    color: '#495057',
    fontSize: '14px',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  errorContainer: {
    padding: '20px', 
    backgroundColor: '#ffebee', 
    border: '1px solid #f44336',
    borderRadius: '8px',
    margin: '20px 0',
    color: '#d32f2f',
  },
};

export default function Agenda_v() {
  console.log('Agenda_v est rendu');
  
  // Gestion des erreurs
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  
  // Composant de secours en cas d'erreur
  if (hasError) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={{ marginTop: 0, color: '#d32f2f' }}>Une erreur est survenue</h2>
        <p>{errorInfo?.toString() || 'Erreur inconnue'}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#d32f2f',
            }
          }}
        >
          Recharger la page
        </button>
      </div>
    );
  }
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [debiteurFilter, setDebiteurFilter] = useState("");
  const [intervenantFilter, setIntervenantFilter] = useState("");
  const [dossierInterneFilter, setDossierInterneFilter] = useState("");
  const [dossierExterneFilter, setDossierExterneFilter] = useState("");
  const [activeTable, setActiveTable] = useState("general");
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDossier, setShowDossier] = useState(false);
  const [dossiers, setDossier] = useState([]);


  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

//   const verifyUser = async () => {
//     try {
//       console.log("verifyUser called of role :",localStorage.getItem("Role"))
//       const res = await axios.get(
//         "http://localhost:3004/auth/visiteur",
//         { withCredentials: true }
//       );
//     } catch (err) {
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     verifyUser()
//   },[])

  const handleCheckboxChange = (rowIndex) => {
    setCheckedRows((prev) => {
      if (prev.includes(rowIndex)) {
        return prev.filter((i) => i !== rowIndex); // Décocher
      } else {
        return [...prev, rowIndex]; // Cocher
      }
    });
  };
  const handleCheckAll = () => {
    if (checkAll) {
      setCheckedRows([]);
    } else {
      const allIndices = filteredData.map((_, idx) => idx);
      setCheckedRows(allIndices);
    }
    setCheckAll(!checkAll);
  };
  
  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);
  const [showPopup, setShowPopup] = useState(false);
const popupRef = useRef(null);

// Ferme le popup si on clique à l’extérieur
useEffect(() => {
  
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  
  useEffect(() => {
    setLoading(true);
    
    // Vérifier si nous avons déjà des données en cache
    const cachedData = sessionStorage.getItem("dossiersVisiteur");
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
        setLoading(false);
      } catch (e) {
        console.error("Erreur lors du parsing des données en cache:", e);
        sessionStorage.removeItem("dossiersVisiteur");
      }
    }

    // Initialisation de la connexion socket
    socketRef.current = io("http://localhost:3004", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("✅ Connected to socket server:", socket.id);
      // Demander les données à chaque reconnexion
      socket.emit("getDossierAgenda", {
        id: localStorage.getItem("UserId"),
        role: localStorage.getItem("Role"),
      });
    };

    const handleDisconnect = () => {
      console.log("🔌 Disconnected from socket server");
    };

    const handleReconnect = (attemptNumber) => {
      console.log(`♻️ Reconnection attempt ${attemptNumber}`);
    };

    const handleData = (dossiers) => {
      try {
        const parsedData = JSON.parse(dossiers);
        console.log("📦 Données reçues, nombre d'éléments:", parsedData.length);
        setData(parsedData);
        // Mettre en cache les données reçues
        sessionStorage.setItem("dossiersVisiteur", dossiers);
      } catch (e) {
        console.error("Erreur lors du parsing des données:", e);
        setError("Erreur lors du traitement des données");
      } finally {
        setLoading(false);
      }
    };

    const handleError = (errMsg) => {
      console.error("❌ Erreur du serveur:", errMsg);
      setError(errMsg);
      setLoading(false);
    };

    // Configurer les écouteurs d'événements
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);
    socket.on("dossiersAgendaData", handleData);
    socket.on("dossiersAgendaError", handleError);

    // Nettoyage lors du démontage du composant
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
      socket.off("dossiersAgendaData", handleData);
      socket.off("dossiersAgendaError", handleError);
      
      // Ne pas déconnecter complètement pour permettre la reconnexion
      // si le composant est rapidement remonté
      setTimeout(() => {
        if (socket.connected) {
          socket.disconnect();
        }
      }, 1000);
    };
  }, []);


  const getFilteredData = () => {
    if (activeTable === "general") {
      return data;
    }
    if(activeTable === "Archive") {
      return data.filter((item) => item.dossier && item.dossier.gestionnaireId === null);
    }  
    return data.filter((item) => item.dossier && item.dossier.etat === activeTable);
  };


  const handleCardClick = (tableType) => {
    setActiveTable(tableType);
  };

  const handleRowClick = (client) => {
    setSelectedClient(client);
    setShowDossier(true);
  };

  const handleResetFilters = () => {
    setDebiteurFilter("");
    setIntervenantFilter("");
    setDossierInterneFilter("");
    setDossierExterneFilter("");
  };

  const filteredData = useMemo(() => {
    return getFilteredData().filter((row) => {
      const debiteur = row.debiteurInfo?.debiteur || {};
      const matchesDebiteur = !debiteurFilter || (debiteur.nom || '').toLowerCase().includes(debiteurFilter.toLowerCase());
      const matchesCIN = !intervenantFilter || (debiteur.CIN || '').toLowerCase().includes(intervenantFilter.toLowerCase());
      const matchesDossier = !dossierInterneFilter || (row.dossier?.NDossier || '').toLowerCase().includes(dossierInterneFilter.toLowerCase());
      return matchesDebiteur && matchesCIN && matchesDossier;
    });
  }, [data, debiteurFilter, intervenantFilter, dossierInterneFilter]);

  const thStyle = {
    padding: "0.5rem",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
    color: "#1e293b",
    fontWeight: 600,
    fontSize: "0.75rem",
  };

  const tdStyle = {
    padding: "0.5rem",
    textAlign: "center",
  };

  const exportToExcel = () => {
    // Créer un nouveau classeur Excel
    const XLSX = require('xlsx');
    const wb = XLSX.utils.book_new();
    
    // Préparer les données pour l'export
    const excelData = filteredData.map(row => ({
      'Client': row.client?.marche || '',
      'Débiteur': row.debiteurInfo?.debiteur?.nom || '',
      'CIN': row.debiteurInfo?.debiteur?.CIN || '',
      'N° Dossier': row.dossier?.NDossier || '',
      'Solde': row.creance?.creance || 0,
      'Gestionnaire': row.gestionnaire || '---',
      'Dernière action': Array.isArray(row.actions) && row.actions.length > 0 
        ? row.actions[row.actions.length - 1].action 
        : 'Aucune action'
    }));
    
    // Créer une feuille de calcul à partir des données
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Ajouter la feuille de calcul au classeur
    XLSX.utils.book_append_sheet(wb, ws, 'Dossiers');
    
    // Générer le fichier Excel et le télécharger
    XLSX.writeFile(wb, `export_dossiers_${new Date().toISOString().split('T')[0]}.xlsx`);
  };


  // Styles pour les cellules du tableau
  const tableStyles = {
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      backgroundColor: '#f8f9fa',
      color: '#6c757d',
      fontWeight: 600,
      fontSize: '14px',
      borderBottom: '1px solid #e9ecef',
    },
    td: {
      padding: '12px 16px',
      borderBottom: '1px solid #e9ecef',
      color: '#495057',
      fontSize: '14px',
    },
    // Ajout de styles pour les états de survol
    hover: {
      backgroundColor: '#f0f9ff',
    },
    // Style pour les lignes paires/impaires
    row: (index) => ({
      backgroundColor: index % 2 === 0 ? '#f8fafc' : '#fff',
      transition: 'background-color 0.2s',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#f0f9ff',
      },
    }),
  };

  // Fonction pour obtenir le style du badge en fonction du statut
  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: '6px 12px',
      fontSize: '12px',
      borderRadius: '12px',
      fontWeight: '500',
      display: 'inline-block',
    };

    switch (status?.toLowerCase()) {
      case 'en cours':
        return {
          ...baseStyle,
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
        };
      case 'terminé':
        return {
          ...baseStyle,
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
        };
      case 'en attente':
        return {
          ...baseStyle,
          backgroundColor: '#fff8e1',
          color: '#ff8f00',
        };
      case 'archive':
        return {
          ...baseStyle,
          backgroundColor: '#f5f5f5',
          color: '#616161',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#f5f5f5',
          color: '#757575',
        };
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
      fontFamily: "'Roboto', sans-serif"
    }}>
      <main style={{ 
        flex: 1, 
        padding: "1.5rem", 
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        {/* En-tête */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem"
        }}>
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#2d3748",
            margin: 0
          }}>Agenda des dossiers</h1>
          
          <button
            onClick={exportToExcel}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0d9488",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0f766e"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#0d9488"}
          >
            <span>Exporter en Excel</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Cartes de statistiques */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem"
        }}>
          <StatCards onCardClick={handleCardClick} dossiers={data} />
        </div>

        {/* Filtres et tableau */}
        <div style={{ 
          display: "flex", 
          gap: "1.5rem",
          flex: 1,
          minHeight: 0,
          backgroundColor: "#f8fafc",
          padding: "1.25rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <Filtrage
            debiteurFilter={debiteurFilter}
            setDebiteurFilter={setDebiteurFilter}
            intervenantFilter={intervenantFilter}
            setIntervenantFilter={setIntervenantFilter}
            dossierInterneFilter={dossierInterneFilter}
            setDossierInterneFilter={setDossierInterneFilter}
            dossierExterneFilter={dossierExterneFilter}
            setDossierExterneFilter={setDossierExterneFilter}
            handleResetFilters={handleResetFilters}
          />
  
          <section style={{
            flex: 1,
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              padding: "1rem",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#2d3748",
                margin: 0
              }}>Liste des dossiers</h2>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => checkedRows.length > 0 && setShowPopup(true)}
                  disabled={checkedRows.length === 0}
                  style={{
                    background: "none",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    cursor: checkedRows.length === 0 ? "not-allowed" : "pointer",
                    padding: "0.375rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    opacity: checkedRows.length === 0 ? 0.5 : 1,
                    transition: "all 0.2s",
                    '&:hover:not(:disabled)': {
                      backgroundColor: "#f7fafc"
                    }
                  }}
                  title={
                    checkedRows.length === 0
                      ? "Sélectionnez d'abord au moins un dossier"
                      : "Partager la sélection"
                  }
                >
                  <FaExchangeAlt size={16} />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            <div style={{ 
              flex: 1, 
              overflow: "auto",
              position: "relative"
            }}>
              {loading ? (
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                  color: "#718096"
                }}>
                  Chargement en cours...
                </div>
              ) : error ? (
                <div style={{
                  padding: "1rem",
                  backgroundColor: "#fff5f5",
                  color: "#e53e3e",
                  borderRadius: "0.375rem",
                  margin: "1rem"
                }}>
                  {error}
                </div>
              ) : (
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px"
                }}>
                  <thead>
                    <tr>
                      <th style={{
                        ...thStyle,
                        width: "60px",
                        textAlign: "center"
                      }}>
                        <input 
                          type="checkbox" 
                          checked={checkAll}
                          onChange={handleCheckAll}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer"
                          }}
                        />
                      </th>
                      {["Client", "Débiteur", "CIN", "Dossier", "Solde", "Gestionnaire", "Statut"].map((text, i) => (
                        <th key={i} style={thStyle}>
                          {text}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: index % 2 === 0 ? "#f8fafc" : "#fff",
                            transition: "background-color 0.2s",
                            '&:hover': {
                              backgroundColor: "#f0f9ff"
                            }
                          }}
                          onClick={() => handleRowClick(row)}
                        >
                          <td 
                            style={{
                              ...tdStyle,
                              textAlign: "center"
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={checkedRows.includes(row.dossier?.id)}
                              onChange={() => handleCheckboxChange(row.dossier?.id)}
                              style={{
                                width: "16px",
                                height: "16px",
                                cursor: "pointer"
                              }}
                            />
                          </td>
                          <td style={tdStyle}>
                            <div style={{ fontWeight: 500 }}>{row.client?.marche || '-'}</div>
                          </td>
                          <td style={tdStyle}>
                            <div>{row.debiteurInfo?.debiteur?.nom || '-'}</div>
                          </td>
                          <td style={tdStyle}>{row.debiteurInfo?.debiteur?.CIN || '-'}</td>
                          <td style={tdStyle}>
                            <div style={{ fontWeight: 500 }}>{row.dossier?.NDossier || '-'}</div>
                          </td>
                          <td style={tdStyle}>
                            {row.creance?.creance ? (
                              <span style={{ 
                                    fontWeight: 500,
                                    color: "#2d3748"
                                  }}>
                                {new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: 'MAD'
                                }).format(row.creance.creance)}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={tdStyle}>
                            {row.gestionnaire || "---"}
                          </td>
                          <td style={tdStyle}>
                            {Array.isArray(row.actions) && row.actions.length > 0 ? (
                              <span style={getStatusBadgeStyle(row.actions[row.actions.length - 1].action)}>
                                {row.actions[row.actions.length - 1].action}
                              </span>
                            ) : (
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                backgroundColor: '#f0f5ff',
                                color: '#3b82f6',
                                fontWeight: 500
                              }}>
                                Aucune action
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td 
                          colSpan="8" 
                          style={{
                            ...tdStyle,
                            textAlign: "center",
                            padding: "2rem",
                            color: "#718096"
                          }}
                        >
                          Aucun dossier trouvé avec les critères sélectionnés
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Modal de partage */}
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          backdropFilter: "blur(2px)"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#2d3748"
              }}>
                Partager la sélection
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#718096",
                  '&:hover': {
                    color: "#4a5568"
                  }
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <p style={{ marginBottom: "1rem", color: "#4a5568" }}>
                Sélectionnez un gestionnaire pour partager {checkedRows.length} dossier(s) :
              </p>
              <div style={{
                display: "grid",
                gap: "0.75rem",
                marginBottom: "1.5rem"
              }}>
                {["Imane", "Aya", "Saad", "Omar"].map((gestionnaire, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: "0.75rem 1rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      '&:hover': {
                        backgroundColor: "#f8fafc",
                        borderColor: "#cbd5e0"
                      }
                    }}
                    onClick={() => {
                      // Logique de partage ici
                      console.log(`Partager avec ${gestionnaire}`, checkedRows);
                      setShowPopup(false);
                    }}
                  >
                    <div style={{ fontWeight: 500, color: "#2d3748" }}>{gestionnaire}</div>
                    <div style={{ fontSize: "0.875rem", color: "#718096" }}>
                      Gestionnaire principal
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "1.25rem"
              }}>
                <button
                  onClick={() => setShowPopup(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#f7fafc",
                    color: "#4a5568",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    '&:hover': {
                      backgroundColor: "#edf2f7"
                    }
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail du dossier */}
      {showDossier && selectedClient && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            width: "100%",
            maxWidth: "1200px",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <button 
              onClick={() => setShowDossier(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                backgroundColor: "#f7fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "9999px",
                width: "2rem",
                height: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s",
                '&:hover': {
                  backgroundColor: "#edf2f7"
                }
              }}
            >
              &times;
            </button>
            <GestionDossier 
              client={selectedClient} 
              onClose={() => setShowDossier(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
