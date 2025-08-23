

import React, { useEffect, useState } from "react";
import axios from "axios";

const PopupAction = ({ onClose, onSave, dossier }) => {
  const [step, setStep] = useState(1);
  const [statuts, setStatus] = useState([]);
  const [sorts, setSorts] = useState([]);
  const [actions,setActions] = useState([])
  const [groupedAction, setGroupedAction] = useState({});
    const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  const [formData, setFormData] = useState({
    familleAction: "",
    action: "",
    dateExecution: new Date().toISOString().split("T")[0],
    detail: "",
    sort: "",
    actionSuivante: "",
    dateActionSuivante: "",
    statutPrecedent: "INITIE",
    nouveauStatus: "",
    dossierId: "",
  });

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/status`);
      setStatus(res.data.filter((status) => status.visibility == 1));
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchSorts = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/sorts`);
      setSorts(res.data.filter((sort) => sort.visibility == 1));
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchActionGouped = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/action/getActionGrouped`);
      setGroupedAction(res.data || {});
    } catch (err) {
      console.log(err.message);
      // Set empty object as fallback
      setGroupedAction({});
    }
  };

    const fetchActions = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/actions`);
      setActions(res.data.filter((item)=>item.visibility == 1));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchSorts();
    fetchActionGouped();
    fetchActions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "familleAction") {
      setFormData((prev) => ({
        ...prev,
        familleAction: value,
        action: "", // reset action si famille changée
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleValidateStep1 = () => {
    if (!formData.familleAction || !formData.action) {
      alert("Merci de remplir tous les champs requis.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      actionSuivante: prev.action, // on copie l'action choisie comme action suivante
      dossierId: dossier?.dossier?.id || "", // Set the dossier ID
    }));

    setStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.sort || !formData.nouveauStatus || !formData.dateActionSuivante) {
      alert("Merci de remplir tous les champs requis.");
      return;
    }

    onSave(formData);
    onClose();
  };

  // Get available actions for selected famille
  const getAvailableActions = () => {
    if (!formData.familleAction || !groupedAction[formData.familleAction]) {
      return [];
    }
    return groupedAction[formData.familleAction];
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={{ ...styles.header, backgroundColor: "#7d0022" }}>
          <h2 style={styles.headerTitle}>
            {step === 1
              ? "AJOUTER UNE NOUVELLE TÂCHE"
              : "EXÉCUTION DE L'ACTION"}
          </h2>
        </div>

        <div style={styles.form}>
          {step === 1 ? (
            <>
              <label style={styles.label}>Famille d'action:</label>
              <select
                name="familleAction"
                value={formData.familleAction}
                onChange={handleChange}
                style={styles.smallSelect}
              >
                <option value="">-- Choisir --</option>
                {Object.keys(groupedAction).map((famille) => (
                  <option key={famille} value={famille}>
                    {famille}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Action:</label>
              <select
                name="action"
                value={formData.action}
                onChange={handleChange}
                style={styles.smallSelect}
                disabled={!formData.familleAction}
              >
                <option value="">-- Choisir --</option>
                {getAvailableActions().map((action, index) => (
                  <option key={index} value={action}>
                    {action}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Date prévue:</label>
              <input
                type="date"
                readOnly
                name="datePrevue"
                value={dossier.dossier.date_prevu}
                style={styles.smallInput}
              />

              <div style={styles.buttons}>
                <button onClick={onClose} style={styles.cancel}>
                  FERMER
                </button>
                <button onClick={handleValidateStep1} style={styles.validate}>
                  VALIDER
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleFinalSubmit}>
              <div style={styles.row}>
                <div style={styles.column}>
                  <label style={styles.label}>Action en cours:</label>
                  <input
                    type="text"
                    value={formData.action}
                    readOnly
                    style={styles.smallInput}
                  />
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Date prévue:</label>
                  <input
                    type="date"
                    readOnly
                    value={dossier?.dossier?.date_prevu || ""}
                    style={styles.smallInput}
                  />
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Date d'exécution:</label>
                  <input
                    type="date"
                    name="dateExecution"
                    value={formData.dateExecution}
                    style={styles.smallInput}
                    readOnly
                  />
                </div>
              </div>

              <label style={styles.label}>Commentaire :</label>
              <textarea
                name="detail"
                value={formData.detail}
                onChange={handleChange}
                style={styles.textarea}
                placeholder="Ajouter un commentaire..."
              />

              <div style={styles.row}>
                <div style={styles.column}>
                  <label style={styles.label}>Sort:</label>
                  <select
                    name="sort"
                    value={formData.sort}
                    onChange={handleChange}
                    style={styles.smallSelect}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {sorts.map((sort, index) => (
                      <option key={index} value={sort.sortValue}>
                        {sort.sortValue}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Action suivante:</label>
                  <select
                    type="text"
                    value={formData.actionSuivante}
                    style={styles.smallInput}
                    onChange={handleChange}
                    name = "actionSuivante"
                  >
                     {actions.map((action, index) => (
                      <option key={index} value={action.nomAction}>
                        {action.nomAction}
                      </option>
                     ))} 
                  </select>
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Date d'action suivante:</label>
                  <input
                    type="date"
                    required
                    name="dateActionSuivante"
                    value={formData.dateActionSuivante}
                    onChange={handleChange}
                    style={styles.smallInput}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.column}>
                  <label style={styles.label}>Statut précédent:</label>
                  <input
                    type="text"
                    value={dossier?.dossier?.status || ""}
                    readOnly
                    style={{ ...styles.smallInput, backgroundColor: "#eee" }}
                  />
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Nouveau statut :</label>
                  <select
                    name="nouveauStatus"
                    required
                    value={formData.nouveauStatus}
                    onChange={handleChange}
                    style={styles.smallSelect}
                  >
                    <option value="">-- Choisir --</option>
                    {statuts.map((s, index) => (
                      <option key={index} value={s.statusValue}>
                        {s.statusValue}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.buttons}>
                <button type="button" onClick={onClose} style={styles.cancel}>
                  FERMER
                </button>
                <button type="submit" style={styles.validate}>
                  VALIDER
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "75%",
    maxWidth: "700px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  header: {
    padding: "12px 20px",
  },
  headerTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
  },
  form: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
  },
  smallInput: {
    padding: "6px",
    fontSize: "13px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  smallSelect: {
    padding: "6px",
    fontSize: "13px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "6px",
    fontSize: "13px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "50px",
    resize: "vertical",
    width: "100%",
    boxSizing: "border-box",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
  validate: {
    background: "transparent",
    color: "#7d0022",
    fontWeight: "bold",
    fontSize: "13px",
    border: "none",
    cursor: "pointer",
    padding: "8px 16px",
  },
  cancel: {
    background: "transparent",
    color: "#999",
    fontWeight: "bold",
    fontSize: "13px",
    border: "none",
    cursor: "pointer",
    padding: "8px 16px",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
  column: {
    flex: "1 1 200px",
    minWidth: "180px",
  },
};

export default PopupAction;