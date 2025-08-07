import React, { useState } from "react";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";

const actionsOptions    = ["Appel téléphonique", "Cadrage", "Internet", "Divers", "Terrain"];
const marcheOptions     = ["CIH", "BMCE", "CDM"];
const cadrageOptions    = ["Téléphonique", "Terrain"];
const reglementOptions  = ["Versement", "Production"];
const statutOptions     = ["À rappeler", "Contestation", "En cours de traitement"];
const lotOptions        = ["Lot1", "Lot2"];
const modeOptions       = ["1", "2"];
const sortOptions       = ["NRP", "Eteint", "Appel effectué", "Faux num"];

export default function StyledForm() {
  const [values, setValues] = useState({
    "Gestion des actions": [],
    "Gestion du marché": [],
    "Type de cadrage": [],
    "Type de règlement": [],
    "Statut": [],
    "Lot ": [],
    "Mode de réglement ": [],
    "Sort ": [],
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupLabel, setPopupLabel] = useState(null);
  const [addPopupLabel, setAddPopupLabel] = useState(null);
  const [selectedToDelete, setSelectedToDelete] = useState("");
  const [newOptionText, setNewOptionText] = useState("");

  const toggleDropdown = (label) =>
    setOpenDropdown(openDropdown === label ? null : label);

  const handleCheck = (label, opt) => {
    const sel = values[label] || [];
    setValues({
      ...values,
      [label]: sel.includes(opt) ? sel.filter((v) => v !== opt) : [...sel, opt],
    });
  };

  const openAdd = (label) => {
    setAddPopupLabel(label);
    setNewOptionText("");
  };

  const confirmAdd = () => {
    if (!newOptionText.trim()) return;
    switch (addPopupLabel) {
      case "Gestion des actions":
        actionsOptions.push(newOptionText.trim());
        break;
      case "Gestion du marché":
        marcheOptions.push(newOptionText.trim());
        break;
      case "Type de cadrage":
        cadrageOptions.push(newOptionText.trim());
        break;
      case "Type de règlement":
        reglementOptions.push(newOptionText.trim());
        break;
      case "Statut":
        statutOptions.push(newOptionText.trim());
        break;
      case "Lot ":
        lotOptions.push(newOptionText.trim());
        break;
      case "Mode de réglement ":
        modeOptions.push(newOptionText.trim());
        break;
      case "Sort ":
        sortOptions.push(newOptionText.trim());
        break;
    }
    setAddPopupLabel(null);
  };
  const cancelAdd = () => setAddPopupLabel(null);

  const openDelete = (label) => {
    setPopupLabel(label);
    setSelectedToDelete("");
  };
  const confirmDelete = () => {
    if (!selectedToDelete) return;
    const remove = (arr) => {
      const idx = arr.indexOf(selectedToDelete);
      if (idx !== -1) arr.splice(idx, 1);
    };
    switch (popupLabel) {
      case "Gestion des actions": remove(actionsOptions); break;
      case "Gestion du marché": remove(marcheOptions); break;
      case "Type de cadrage": remove(cadrageOptions); break;
      case "Type de règlement": remove(reglementOptions); break;
      case "Statut": remove(statutOptions); break;
      case "Lot ": remove(lotOptions); break;
      case "Mode de réglement ": remove(modeOptions); break;
      case "Sort ": remove(sortOptions); break;
    }
    setPopupLabel(null);
  };
  const cancelDelete = () => setPopupLabel(null);

  const labels = [
    "Gestion des actions",
    "Gestion du marché",
    "Type de cadrage",
    "Type de règlement",
    "Statut",
    "Lot ",
    "Mode de réglement ",
    "Sort ",
  ].filter((lbl) => lbl.toLowerCase().includes(searchTerm.toLowerCase()));

  const getOptions = (label) => {
    switch (label) {
      case "Gestion des actions": return actionsOptions;
      case "Gestion du marché": return marcheOptions;
      case "Type de cadrage": return cadrageOptions;
      case "Type de règlement": return reglementOptions;
      case "Statut": return statutOptions;
      case "Lot ": return lotOptions;
      case "Mode de réglement ": return modeOptions;
      case "Sort ": return sortOptions;
      default: return [];
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "30px auto", padding: "30px", borderRadius: "20px", backgroundColor: "#cfc9c93f", boxShadow: "0 2px 20px rgba(113,110,110,1)", fontFamily: "sans-serif", marginTop: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>PARAMETRAGE</h2>
        <div style={{ position: "relative", width: "300px" }}>
          <input type="text" placeholder="Recherche rapide..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "80%", padding: "10px 40px 10px 15px", borderRadius: "20px", border: "1px solid #ddd", fontSize: "16px", backgroundColor: "#b1b1b1ff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }} />
          <FaSearch style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#4f4c4cff" }} />
        </div>
      </div>

      {labels.map((label) => {
        const opts = getOptions(label);
        const sel = values[label] || [];
        return (
          <div key={label} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "12px", backgroundColor: "#c5bfbf94", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label onClick={() => toggleDropdown(label)} style={{ fontWeight: "bold", cursor: "pointer" }}>{label}</label>
              <div style={{ display: "flex", gap: "5px" }}>
                <button title="Ajouter" onClick={() => openAdd(label)} style={{ backgroundColor: "#cdb6beff", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer" }}><FaPlus /></button>
                <button title="Supprimer" onClick={() => openDelete(label)} style={{ backgroundColor: "#590031ff", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer" }}><FaTrash /></button>
              </div>
            </div>
            {openDropdown === label && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "10px", backgroundColor: "#fefefeff", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}>
                {opts.map((opt) => (
                  <div key={opt} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <input type="checkbox" id={`${label}-${opt}`} name={label} value={opt} checked={sel.includes(opt)} onChange={() => handleCheck(label, opt)} />
                    <label htmlFor={`${label}-${opt}`}>{opt}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {(popupLabel || addPopupLabel) && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", width: "420px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
            {popupLabel && (
              <>
                <h3 style={{ marginBottom: "15px" }}>Supprimer une option de « {popupLabel} »</h3>
                <select value={selectedToDelete} onChange={(e) => setSelectedToDelete(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ccc" }}>
                  <option value="">Sélectionner une option</option>
                  {getOptions(popupLabel).map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button onClick={cancelDelete} style={{ backgroundColor: "#ccc", padding: "10px 14px", borderRadius: "6px", border: "none" }}>Annuler</button>
                  <button onClick={confirmDelete} style={{ backgroundColor: "#4e0202ff", color: "white", padding: "10px 14px", borderRadius: "6px", border: "none" }}>Supprimer</button>
                </div>
              </>
            )}
            {addPopupLabel && (
              <>
                <h3 style={{ marginBottom: "15px" }}>Ajouter une option à « {addPopupLabel} »</h3>
                <input type="text" placeholder="Nouvelle option" value={newOptionText} onChange={(e) => setNewOptionText(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ccc" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button onClick={cancelAdd} style={{ backgroundColor: "#ccc", padding: "10px 14px", borderRadius: "6px", border: "none" }}>Annuler</button>
                  <button onClick={confirmAdd} style={{ backgroundColor: "#500404ff", color: "white", padding: "10px 14px", borderRadius: "6px", border: "none" }}>Ajouter</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
