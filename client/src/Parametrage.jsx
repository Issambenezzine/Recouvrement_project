import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function StyledForm() {
  // Individual states for each parameter
  const [gestionActionsValues, setGestionActionsValues] = useState([]);
  const [familleActionsValues, setFamilleActionsValues] = useState([]);
  const [gestionMarcheValues, setGestionMarcheValues] = useState([]);
  const [typeReglementValues, setTypeReglementValues] = useState([]);
  const [statutValues, setStatutValues] = useState([]);
  const [lotValues, setLotValues] = useState([]);
  const [modeReglementValues, setModeReglementValues] = useState([]);
  const [commissione, setCommissione] = useState();
  const [sortValues, setSortValues] = useState([]);
  const navigate = useNavigate();
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;

  // Dropdown states

  // Dropdown states
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const [familleDropdownOpen, setFamilleDropdownOpen] = useState(false);
  const [marcheDropdownOpen, setMarcheDropdownOpen] = useState(false);
  const [reglementDropdownOpen, setReglementDropdownOpen] = useState(false);
  const [statutDropdownOpen, setStatutDropdownOpen] = useState(false);
  const [lotDropdownOpen, setLotDropdownOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Search and popup states
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePopupType, setDeletePopupType] = useState(null);
  const [addPopupType, setAddPopupType] = useState(null);
  const [selectedToDelete, setSelectedToDelete] = useState("");
  const [newOptionText, setNewOptionText] = useState("");


    const [familleId,setFamilleId] = useState()


/**
 * Function to verify admin user authentication
 * Makes an API call to check if the user is authenticated as admin
 * If authentication fails, redirects to home page
 */
  const verifyUser = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/auth/admin`, {
        withCredentials: true,
      });
    } catch (err) {
      navigate("/");
    }
  };


  const fetchClient = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/clients`);
      setGestionMarcheValues(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  const fetchLots = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/lots`);
      setLotValues(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/status`);
      setStatutValues(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchActions = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/actions`);
      setGestionActionsValues(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchFamilleActions = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/famille`);
      setFamilleActionsValues(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchTypeReglement = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/typereg`);
      setTypeReglementValues(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchModeReglement = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/modereg`);
      setModeReglementValues(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchSorts = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/sorts`);
      setSortValues(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    verifyUser();
    fetchClient();
    fetchLots();
    fetchStatus();
    fetchActions();
    fetchFamilleActions();
    fetchTypeReglement();
    fetchModeReglement();
    fetchSorts();
  }, []);

  // Individual checkbox handlers
  const handleActionsCheck = async (option) => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/parametrage/actions/visibility`,
        {
          id: option,
        },
        {
          withCredentials: true,
        }
      );
      fetchActions();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleMarcheCheck = async (option) => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/parametrage/clients/visibility`,
        {
          id: option,
        },
        {
          withCredentials: true,
        }
      );
      fetchClient();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleReglementCheck = async (option) => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/parametrage/typereg/visibility`,
        {
          id: option,
        },
        {
          withCredentials: true,
        }
      );
      fetchTypeReglement();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleStatutCheck = async (option) => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/parametrage/status/visibility`,
        {
          id: option,
        },
        {
          withCredentials: true,
        }
      );
      fetchStatus();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleLotCheck = async (option) => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/parametrage/lots/visibility`,
        {
          id: option,
        },
        {
          withCredentials: true,
        }
      );
      fetchLots();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleFamilleCheck = async (option) => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/parametrage/famille/visibility`,
        {
          id: option,
        },
        {
          withCredentials: true,
        }
      );
      fetchFamilleActions();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleModeCheck = async (option) => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/parametrage/modereg/visibility`,
        {
          id: option,
        },
        {
          withCredentials: true,
        }
      );
      fetchModeReglement();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSortCheck = async (option) => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/parametrage/sorts/visibility`,
        {
          id: option,
        },
        {
          withCredentials: true,
        }
      );
      fetchSorts();
    } catch (err) {
      console.log(err.message);
    }
  };

  // Add option functions
  const openAdd = (type) => {
    setAddPopupType(type);
  };

  const confirmAdd = async () => {
    let url;
    let fetch;
    if (!newOptionText.trim()) return;

    switch (addPopupType) {
      case "actions":
        url = `http://${HOST}:${PORT}/parametrage/actions/save`;
        fetch = () => fetchActions();
        break;
      case "famille":
        url = `http://${HOST}:${PORT}/parametrage/famille/save`;
        fetch = () => fetchFamilleActions();
        break;
      case "marche":
        url = `http://${HOST}:${PORT}/parametrage/clients/save`;
        fetch = () => fetchClient();
        break;
      case "reglement":
        url = `http://${HOST}:${PORT}/parametrage/typereg/save`;
        fetch = () => fetchTypeReglement();
        break;
      case "statut":
        url = `http://${HOST}:${PORT}/parametrage/status/save`;
        fetch = () => fetchStatus();
        break;
      case "lot":
        url = `http://${HOST}:${PORT}/parametrage/lots/save`;
        fetch = () => fetchLots();
        break;
      case "mode":
        url = `http://${HOST}:${PORT}/parametrage/modereg/save`;
        fetch = () => fetchModeReglement();
        break;
      case "sort":
        url = `http://${HOST}:${PORT}/parametrage/sorts/save`;
        fetch = () => fetchSorts();
        break;
    }

    try {
      let res;
      if(addPopupType === "actions") {
        res = await axios.post(
          url,
          {
            option: newOptionText.trim(), famille: familleId
          },
          {
            withCredentials: true,
          }
        );
      }else if(addPopupType === "marche") {
          res = await axios.post(
          url,
          {
            option: newOptionText.trim(), commiss: commissione
          },
          {
            withCredentials: true,
          }
        );
      }else {
        res = await axios.post(
          url,
          {
            option: newOptionText.trim(),
          },
          {
            withCredentials: true,
          }
        );
      }
      
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
      setNewOptionText("")
      fetch();
    } catch (err) {
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
      console.log(err.message);
    }

    setAddPopupType(null);
  };

  // Delete option functions
  const openDelete = (type) => {
    setDeletePopupType(type);
    setSelectedToDelete("");
  };

  const confirmDelete = async () => {
    if (!selectedToDelete) return;
    let url;
    let fetch;
    console.log("selected type to delete is : ", selectedToDelete);
    switch (deletePopupType) {
      case "actions":
        url = `http://${HOST}:${PORT}/parametrage/actions/delete`;
        fetch = () => fetchActions();
        break;
      case "famille":
        url = `http://${HOST}:${PORT}/parametrage/famille/delete`;
        fetch = () => fetchFamilleActions();
        break;
      case "marche":
        url = `http://${HOST}:${PORT}/parametrage/clients/delete`;
        fetch = () => fetchClient();
        break;
      case "reglement":
        url = `http://${HOST}:${PORT}/parametrage/typereg/delete`;
        fetch = () => fetchTypeReglement();
        break;
      case "statut":
        url = `http://${HOST}:${PORT}/parametrage/status/delete`;
        fetch = () => fetchStatus();
        break;
      case "lot":
        url = `http://${HOST}:${PORT}/parametrage/lots/delete`;
        fetch = () => fetchLots();
        break;
      case "mode":
        url = `http://${HOST}:${PORT}/parametrage/modereg/delete`;
        fetch = () => fetchModeReglement();
        break;
      case "sort":
        url = `http://${HOST}:${PORT}/parametrage/sorts/delete`;
        fetch = () => fetchSorts();
        break;
    }

    try {
      const res = await axios.delete(
        url,
        {
          data: { id: selectedToDelete },
        },
        {
          withCredentials: true,
        }
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
      fetch();
    } catch (err) {
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
      console.log(err.message);
    }

    setDeletePopupType(null);
  };

  const getOptionsForDelete = (type) => {
    switch (type) {
      case "actions":
        return gestionActionsValues;
      case "famille":
        return familleActionsValues;
      case "marche":
        return gestionMarcheValues;
      case "reglement":
        return typeReglementValues;
      case "statut":
        return statutValues;
      case "lot":
        return lotValues;
      case "mode":
        return modeReglementValues;
      case "sort":
        return sortValues;
      default:
        return [];
    }
  };

  const getPopupTitle = (type) => {
    switch (type) {
      case "actions":
        return "Gestion des actions";
      case "famille":
        return "Gestion des familles d'action";
      case "marche":
        return "Gestion du marché";
      case "reglement":
        return "Type de règlement";
      case "statut":
        return "Statut";
      case "lot":
        return "Lot";
      case "mode":
        return "Mode de règlement";
      case "sort":
        return "Sort";
      default:
        return "";
    }
  };

  // Filter sections based on search
  const shouldShowSection = (sectionName) => {
    return sectionName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "30px",
        borderRadius: "20px",
        backgroundColor: "#cfc9c93f",
        boxShadow: "0 2px 20px rgba(113,110,110,1)",
        fontFamily: "sans-serif",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: 0 }}>PARAMETRAGE</h2>
        <div style={{ position: "relative", width: "300px" }}>
          <input
            type="text"
            placeholder="Recherche rapide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "80%",
              padding: "10px 40px 10px 15px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              fontSize: "16px",
              backgroundColor: "#b1b1b1ff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />
          <FaSearch
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#4f4c4cff",
            }}
          />
        </div>
      </div>

      {shouldShowSection("Gestion des familles d'action") && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#c5bfbf94",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              onClick={() => setFamilleDropdownOpen(!familleDropdownOpen)}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Gestion des familles d'action
            </label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                title="Ajouter"
                onClick={() => openAdd("famille")}
                style={{
                  backgroundColor: "#cdb6beff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </button>
              <button
                title="Supprimer"
                onClick={() => openDelete("famille")}
                style={{
                  backgroundColor: "#590031ff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {familleDropdownOpen && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
                backgroundColor: "#fefefeff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {familleActionsValues.map((option, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="checkbox"
                    // id={`actions-${option}`}
                    checked={option.visibility == 1 ? true : false}
                    onChange={() => handleFamilleCheck(option.id)}
                  />
                  <label>{option.familleAction}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gestion des actions */}
      {shouldShowSection("Gestion des actions") && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#c5bfbf94",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              onClick={() => setActionsDropdownOpen(!actionsDropdownOpen)}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Gestion des actions
            </label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                title="Ajouter"
                onClick={() => openAdd("actions")}
                style={{
                  backgroundColor: "#cdb6beff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </button>
              <button
                title="Supprimer"
                onClick={() => openDelete("actions")}
                style={{
                  backgroundColor: "#590031ff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {actionsDropdownOpen && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
                backgroundColor: "#fefefeff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {gestionActionsValues.map((option, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="checkbox"
                    // id={`actions-${option}`}
                    checked={option.visibility == 1 ? true : false}
                    onChange={() => handleActionsCheck(option.id)}
                  />
                  <label>{option.nomAction}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gestion du marché */}
      {shouldShowSection("Gestion du marché") && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#c5bfbf94",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              onClick={() => setMarcheDropdownOpen(!marcheDropdownOpen)}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Gestion du marché
            </label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                title="Ajouter"
                onClick={() => openAdd("marche")}
                style={{
                  backgroundColor: "#cdb6beff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </button>
              <button
                title="Supprimer"
                onClick={() => openDelete("marche")}
                style={{
                  backgroundColor: "#590031ff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {marcheDropdownOpen && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
                backgroundColor: "#fefefeff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {gestionMarcheValues.map((option, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="checkbox"
                    // id={`marche-${option}`}
                    checked={option.visibility == 1 ? true : false}
                    onChange={() => handleMarcheCheck(option.id)}
                  />
                  <label>{option.marche}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Type de règlement */}
      {shouldShowSection("Type de règlement") && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#c5bfbf94",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              onClick={() => setReglementDropdownOpen(!reglementDropdownOpen)}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Type de règlement
            </label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                title="Ajouter"
                onClick={() => openAdd("reglement")}
                style={{
                  backgroundColor: "#cdb6beff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </button>
              <button
                title="Supprimer"
                onClick={() => openDelete("reglement")}
                style={{
                  backgroundColor: "#590031ff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {reglementDropdownOpen && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
                backgroundColor: "#fefefeff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {typeReglementValues.map((option, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="checkbox"
                    // id={`reglement-${option}`}
                    checked={option.visibility == 1 ? true : false}
                    onChange={() => handleReglementCheck(option.id)}
                  />
                  <label>{option.typeReg}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statut */}
      {shouldShowSection("Statut") && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#c5bfbf94",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              onClick={() => setStatutDropdownOpen(!statutDropdownOpen)}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Statut
            </label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                title="Ajouter"
                onClick={() => openAdd("statut")}
                style={{
                  backgroundColor: "#cdb6beff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </button>
              <button
                title="Supprimer"
                onClick={() => openDelete("statut")}
                style={{
                  backgroundColor: "#590031ff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {statutDropdownOpen && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
                backgroundColor: "#fefefeff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {statutValues.map((stat, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="checkbox"
                    // id={`statut-${option}`}
                    checked={stat.visibility == 1 ? true : false}
                    onChange={() => handleStatutCheck(stat.id)}
                  />
                  <label>{stat.statusValue}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lot */}
      {shouldShowSection("Lot") && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#c5bfbf94",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              onClick={() => setLotDropdownOpen(!lotDropdownOpen)}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Lot
            </label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                title="Ajouter"
                onClick={() => openAdd("lot")}
                style={{
                  backgroundColor: "#cdb6beff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </button>
              <button
                title="Supprimer"
                onClick={() => openDelete("lot")}
                style={{
                  backgroundColor: "#590031ff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {lotDropdownOpen && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
                backgroundColor: "#fefefeff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {lotValues.map((option, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="checkbox"
                    // id={`lot-${option}`}
                    checked={option.visibility == 1 ? true : false}
                    onChange={() => handleLotCheck(option.id)}
                  />
                  <label>{option.Nlot}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode de règlement */}
      {shouldShowSection("Mode de règlement") && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#c5bfbf94",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Mode de règlement
            </label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                title="Ajouter"
                onClick={() => openAdd("mode")}
                style={{
                  backgroundColor: "#cdb6beff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </button>
              <button
                title="Supprimer"
                onClick={() => openDelete("mode")}
                style={{
                  backgroundColor: "#590031ff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {modeDropdownOpen && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
                backgroundColor: "#fefefeff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {modeReglementValues.map((option, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="checkbox"
                    // id={`mode-${option}`}
                    checked={option.visibility == 1 ? true : false}
                    onChange={() => handleModeCheck(option.id)}
                  />
                  <label>{option.modeReg}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sort */}
      {shouldShowSection("Sort") && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#c5bfbf94",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Sort
            </label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                title="Ajouter"
                onClick={() => openAdd("sort")}
                style={{
                  backgroundColor: "#cdb6beff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </button>
              <button
                title="Supprimer"
                onClick={() => openDelete("sort")}
                style={{
                  backgroundColor: "#590031ff",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {sortDropdownOpen && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
                backgroundColor: "#fefefeff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {sortValues.map((option, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="checkbox"
                    // id={`sort-${option}`}
                    checked={option.visibility == 1 ? true : false}
                    onChange={() => handleSortCheck(option.id)}
                  />
                  <label>{option.sortValue}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popups */}
      {(deletePopupType || addPopupType) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "420px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {deletePopupType && (
              <>
                <h3 style={{ marginBottom: "15px" }}>
                  Supprimer une option de « {getPopupTitle(deletePopupType)} »
                </h3>
                <select
                  value={selectedToDelete}
                  onChange={(e) => setSelectedToDelete(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Sélectionner une option</option>
                  {getOptionsForDelete(deletePopupType).map((option, index) => {
                    const getLabel = () => {
                      switch (deletePopupType) {
                        case "statut":
                          return option.statusValue;
                        case "marche":
                          return option.marche;
                        case "lot":
                          return option.Nlot;
                        case "famille":
                          return option.familleAction;
                        case "reglement":
                          return option.typeReg;
                        case "mode":
                          return option.modeReg;
                        case "sort":
                          return option.sortValue;
                        case "actions":
                          return option.nomAction;
                      }
                    };

                    return (
                      <option key={index} value={option.id}>
                        {getLabel()}
                      </option>
                    );
                  })}
                </select>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => setDeletePopupType(null)}
                    style={{
                      backgroundColor: "#ccc",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "none",
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    style={{
                      backgroundColor: "#4e0202ff",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "none",
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </>
            )}
            {addPopupType && (
              <>
                <h3 style={{ marginBottom: "15px" }}>
                  Ajouter une option à « {getPopupTitle(addPopupType)} »
                </h3>
                <input
                  type="text"
                  placeholder="Nouvelle option"
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                  style={{
                    width: "94%",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #ccc",
                  }}
                />
                {addPopupType === "actions" && (
                  <select
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      border: "1px solid #ccc",
                    }}
                    value={familleId}
                    onChange={(e) => setFamilleId(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      Sélectionner une famille d'action
                    </option>
                    {familleActionsValues.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.familleAction}
                      </option>
                    ))}
                  </select>
                )}

                {addPopupType === "marche" && (
                  <input
                    required
                    placeholder="Commissione"
                    type="number"
                    style={{
                      width: "94%",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      border: "1px solid #ccc",
                    }}
                    value={commissione}
                    onChange={(e) => setCommissione(Number(e.target.value))}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => setAddPopupType(null)}
                    style={{
                      backgroundColor: "#ccc",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "none",
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmAdd}
                    style={{
                      backgroundColor: "#500404ff",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "none",
                    }}
                  >
                    Ajouter
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
