// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaSearch } from "react-icons/fa";
// import { MdEdit } from "react-icons/md";

// import axios from "axios";

// const G_gestionnaires = () => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [editPopup, setEditPopup] = useState(false);
//   const [states, setStates] = useState([]);

//   useEffect(() => {
//     const fetchGestionnairesStats = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:3004/responsable/gestionnaire/stats/${localStorage.getItem(
//             "UserId"
//           )}`
//         );
//         setStates(res.data);
//       } catch (err) {
//         console.log(err.message);
//       }
//     };
//     fetchGestionnairesStats();
//   }, []);

//   const handleEditClick = async (gest) => {
//     setEditPopup(true);
//   };

//   // ✅ Redirection simple vers la page globale
//   const handleViewClick = (id) => {
//     navigate("/manager/dossier", { state: { gestionnaireId: id } });
//   };

//   const filtered = states.filter((g) =>
//     g.gest.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div
//       style={{
//         backgroundColor: "rgba(255, 255, 255, 1)",
//         height: "100vh",
//         fontFamily: "Segoe UI, sans-serif",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         boxSizing: "border-box",
//         padding: "0px 20px 20px",
//         overflow: "hidden",
//       }}
//     >
//       {/* Barre de recherche */}
//       <div
//         style={{
//           marginBottom: "15px",
//           alignSelf: "flex-end",
//           marginRight: "4%",
//         }}
//       >
//         <div style={{ position: "relative", width: "260px" }}>
//           <input
//             type="text"
//             placeholder="Recherche rapide..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "10px 35px 10px 12px",
//               borderRadius: "20px",
//               border: "1px solid #ccc",
//               outline: "none",
//               backgroundColor: "#fff",
//             }}
//           />
//           <FaSearch
//             style={{
//               position: "absolute",
//               right: "12px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: "#666",
//             }}
//           />
//         </div>
//       </div>

//       {/* Tableau avec shadow et header sticky */}
//       <div
//         style={{
//           width: "100%",
//           backgroundColor: "#fff",
//           borderRadius: "12px",
//           boxShadow: "10px 8px 260px rgba(239, 237, 237, 0.72)",
//           flexGrow: 1,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ overflowY: "auto", flexGrow: 1 }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               fontSize: "16px",
//             }}
//           >
//             <thead>
//               <tr
//                 style={{
//                   backgroundColor: "#b9a1a1",
//                   textAlign: "center",
//                   color: "#000",
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 1,
//                 }}
//               >
//                 <th style={{ padding: "12px" }}>NOM DU GESTIONNAIRE</th>
//                 <th>OBJECTIF</th>
//                 <th>NOMBRE DE DOSSIER</th>
//                 <th>NOMBRE DES ACTIONS</th>
//                 <th>VOIR</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((gest, index) => (
//                 <tr
//                   key={index}
//                   style={{
//                     textAlign: "center",
//                     backgroundColor:
//                       index % 2 === 0 ? "#e9e9e9ff" : "#e7e5e5ff",
//                   }}
//                 >
//                   <td style={{ padding: "12px", fontWeight: "bold" }}>
//                     {gest.gest}
//                   </td>
//                   <td>
//                     <span>{gest.obj}</span>
//                     <span
//                       style={{ marginLeft: "5px", cursor: "pointer" }}
//                       onClick={() => handleEditClick(gest)}
//                     >
//                       <MdEdit />
//                     </span>
//                   </td>
//                   <td>{gest.nbr_dossier}</td>
//                   <td>{gest.nbr_action}</td>
//                   <td>
//                     <button
//                       style={{
//                         border: "none",
//                         background: "transparent",
//                         cursor: "pointer",
//                         fontSize: "18px",
//                         color: "#333",
//                       }}
//                       onClick={() => handleViewClick(gest.id)}
//                     >
//                       <FaEye />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan="4"
//                     style={{
//                       padding: "20px",
//                       textAlign: "center",
//                       color: "#999",
//                     }}
//                   >
//                     Aucun gestionnaire trouvé.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {editPopup && (
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "15px",
//             marginTop: "10px",
//             backgroundColor: "#fefefeff",
//             padding: "10px",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//           }}
//         >
//           <div
//             style={{ display: "flex", alignItems: "center", gap: "5px" }}
//           >
//             <label>Modifier L'objectif</label>

//             <input
//               type="number"
//               // id={`reglement-${option}`}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default G_gestionnaires;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSearch, FaTimes } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";
import axios from "axios";

const G_gestionnaires = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [editPopup, setEditPopup] = useState(false);
  const [selectedGest, setSelectedGest] = useState(null);
  const [newObjectif, setNewObjectif] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  useEffect(() => {
    const fetchGestionnairesStats = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/responsable/gestionnaire/stats/${localStorage.getItem(
            "UserId"
          )}`
        );
        setStates(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchGestionnairesStats();
  }, []);

  const handleEditClick = async (gest) => {
    setSelectedGest(gest);
    setNewObjectif(gest.obj);
    setEditPopup(true);
  };

  const handleClosePopup = () => {
    setEditPopup(false);
    setSelectedGest(null);
    setNewObjectif("");
  };

  const handleSaveObjectif = async () => {
    if (!selectedGest || !newObjectif || newObjectif === "") return;

    setLoading(true);
    try {
      // Replace with your actual API endpoint for updating objectif
      const res = await axios.put(
        `http://${HOST}:${PORT}/responsable/objectif`,
        {
          objectif: newObjectif,
          id: selectedGest.id,
          username: selectedGest.gest,
        }
      );

      // Update local state
      setStates((prevStates) =>
        prevStates.map((gest) =>
          gest.id === selectedGest.id ? { ...gest, obj: newObjectif } : gest
        )
      );

      toast.success(`${res.data.message}`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });

      handleClosePopup();
    } catch (err) {
      console.error("Error updating objectif:", err.message);
      toast.error(`${err.response?.data?.message}`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirection simple vers la page globale
  const handleViewClick = (id) => {
    navigate("/manager/dossier", { state: { gestionnaireId: id } });
  };

  const filtered = states.filter((g) =>
    g.gest.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 1)",
        height: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        padding: "0px 20px 20px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Barre de recherche */}
      <div
        style={{
          marginBottom: "15px",
          alignSelf: "flex-end",
          marginRight: "4%",
        }}
      >
        <div style={{ position: "relative", width: "260px" }}>
          <input
            type="text"
            placeholder="Recherche rapide..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 35px 10px 12px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#fff",
            }}
          />
          <FaSearch
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
            }}
          />
        </div>
      </div>

      {/* Tableau avec shadow et header sticky */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "10px 8px 260px rgba(239, 237, 237, 0.72)",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "16px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#b9a1a1",
                  textAlign: "center",
                  color: "#000",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <th style={{ padding: "12px" }}>NOM DU GESTIONNAIRE</th>
                <th>OBJECTIF</th>
                <th>NOMBRE DE DOSSIER</th>
                <th>NOMBRE DES ACTIONS</th>
                <th>VOIR</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((gest, index) => (
                <tr
                  key={index}
                  style={{
                    textAlign: "center",
                    backgroundColor:
                      index % 2 === 0 ? "#e9e9e9ff" : "#e7e5e5ff",
                  }}
                >
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {gest.gest}
                  </td>
                  <td>
                    <span>{gest.obj}</span>
                    <span
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "#666",
                        fontSize: "16px",
                      }}
                      onClick={() => handleEditClick(gest)}
                    >
                      <MdEdit />
                    </span>
                  </td>
                  <td>{gest.nbr_dossier}</td>
                  <td>{gest.nbr_action}</td>
                  <td>
                    <button
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#333",
                      }}
                      onClick={() => handleViewClick(gest.id)}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    Aucun gestionnaire trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup for Edit */}
      {editPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleClosePopup}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              minWidth: "400px",
              maxWidth: "500px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClosePopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#666",
              }}
            >
              <FaTimes />
            </button>

            {/* Modal content */}
            <h3
              style={{
                marginTop: "0",
                marginBottom: "20px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Modifier l'objectif
            </h3>

            {selectedGest && (
              <div style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    marginBottom: "10px",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  Gestionnaire: <strong>{selectedGest.gest}</strong>
                </p>
                <p
                  style={{
                    marginBottom: "15px",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  Objectif actuel: <strong>{selectedGest.obj}</strong>
                </p>
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Nouvel objectif:
              </label>
              <input
                type="number"
                value={newObjectif}
                onChange={(e) => setNewObjectif(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                placeholder="Entrez le nouvel objectif"
              />
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={handleClosePopup}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Annuler
              </button>
              <button
                onClick={(e) => handleSaveObjectif()}
                disabled={loading || !newObjectif || newObjectif === ""}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  backgroundColor:
                    loading || !newObjectif || newObjectif === ""
                      ? "#ccc"
                      : "#500404ff",
                  color: "#fff",
                  borderRadius: "6px",
                  cursor:
                    loading || !newObjectif || newObjectif === ""
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                }}
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default G_gestionnaires;
