// AddUserPopup.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddUserPopup = ({ onClose, onAdd, updateUsers }) => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    tel: "",
    addresse: "",
    role: "responsable",
    responsableId: 3,
    activation: "Active",
  });

  useEffect(() => {
  const fetchManagers = async () => {
    try {
      const res = await axios.get("http://localhost:3004/responsable/get", {
        withCredentials: true,
      });
      setManagers(res.data);
      // Only update responsableId if at least one manager exists
      if (res.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          responsableId: parseInt(res.data[0].id),
        }));
      } else {
        // If no manager, clear responsableId or set a safe fallback
        setFormData((prev) => ({
          ...prev,
          responsableId: null,
        }));
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  fetchManagers();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "manager") {
      setFormData((prev) => ({ ...prev, responsableId: parseInt(value) }));
      console.log("changed")
      console.log(value)
    }else{
      setFormData((prev) => ({ ...prev, [name]: value }));
      console.log(value)
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3004/${formData.role}/save`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(
        `Le ${formData.role.toLowerCase()} ${formData.username.toUpperCase()} a été créé avec succès !`
      );
      updateUsers();
    } catch (err) {
      toast.error(
        `Un erreur de système est survenu !`
      );
    }
    console.log(formData);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Ajouter un utilisateur</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Nom"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {/* <input name="cin" type="text" placeholder="CIN" value={formData.cin} onChange={handleChange} required /> */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="text"
            placeholder="Mot de Passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            name="tel"
            type="text"
            placeholder="Téléphone"
            value={formData.tel}
            onChange={handleChange}
            required
          />
          <input
            name="addresse"
            type="text"
            placeholder="Adresse"
            value={formData.addresse}
            onChange={handleChange}
            required
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value={"admin"}>Admin</option>
            <option value={"gestionnaire"}>Gestionnaire</option>
            <option value={"responsable"}>Manager</option>
            <option value={"visiteur"}>Visiteur</option>
          </select>
          {formData.role === "gestionnaire" && (
            <>
            <label style={{color:"red"}}>Selectionner le Manager</label>
            <select
              name="manager"
              value={formData.responsableId}
              onChange={handleChange}
            >
              <option disabled>--Selectionner un manager--</option>
              {
              managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.username}
                </option>
              ))}
            </select>
            </>
          )}

          <select
            name="activation"
            value={formData.activation}
            onChange={handleChange}
          >
            <option value={"Active"}>AUTORISÉ</option>
            <option value={"Block"}>INTERDIT</option>
          </select>
          <div className="popup-buttons">
            <button type="submit" onClick={updateUsers}>
              Ajouter
            </button>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default AddUserPopup;