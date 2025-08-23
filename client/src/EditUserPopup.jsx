import React, { useState, useEffect } from "react";
import axios from "axios";

const EditUserPopup = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [managers, setManagers] = useState([]);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure responsableId is an integer
    if (name === "responsableId") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  useEffect(() => {
  const fetchManagers = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/responsable/get`, {
        withCredentials: true,
      });
      setManagers(res.data);

      // Ensure responsableId is initialized if missing
      if (user.role === "gestionnaire" && !user.responsableId && res.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          responsableId: res.data[0].id,
        }));
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  fetchManagers();
}, [user]);

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Modifier l'utilisateur</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nom"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="tel"
            type="text"
            value={formData.tel}
            onChange={handleChange}
            placeholder="Téléphone"
          />
          <input
            name="addresse"
            type="text"
            value={formData.addresse}
            onChange={handleChange}
            placeholder="Adresse"
          />

          {/* Show manager select only for "gestionnaire" role */}
          {formData.role === "GESTIONNAIRE" && (
            <>
              <select
                name="responsableId"
                value={formData.responsableId}
                onChange={handleChange}
              >
                <option disabled>-- Sélectionner un manager --</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.username}
                  </option>
                ))}
              </select>
              <label>Objectif</label>
              <input name="objectif" type="number" value={formData.objectif} onChange={handleChange}></input>
            </>
          )}

          <select
            name="activation"
            value={formData.activation}
            onChange={handleChange}
          >
            <option value="Active">AUTORISÉ</option>
            <option value="Block">INTERDIT</option>
          </select>

          <div className="popup-buttons">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPopup;
