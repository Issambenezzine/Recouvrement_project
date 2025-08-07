import React, { useState, useEffect } from "react";
import { FaSortDown, FaTrash, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import AddUserPopup from "./AddUserPopup";
import EditUserPopup from "./EditUserPopup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import { saveUser } from "./API/api"; // <<--- ajout
import "./popup.css";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";
const GProfil = () => {
  // Filter users based on search term

  // const [users, setUsers] = useState([]);
  const [hoveredEdit, setHoveredEdit] = useState(null);
  const [hoveredTrash, setHoveredTrash] = useState(null);
  const [profile, setProfile] = useState([]);
  const [hoveredPlus, setHoveredPlus] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserUsername, setDeleteUserUsername] = useState(null);
  const [deleteUserRole, setDeleteUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const filteredProfiles = profile.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.tel?.toLowerCase().includes(term) ||
      user.addresse?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term) ||
      user.activation?.toLowerCase().includes(term)
    );
  });

  const verifyUser = async () => {
    try {
      console.log("verifyUser called of role :",localStorage.getItem("Role"))
      const res = await axios.get(
        `http://localhost:3004/auth/admin`,
        { withCredentials: true }
      );
    } catch (err) {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyUser()
  },[])

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3004/user/users");
      setProfile(res.data);
    } catch (err) {
      toast.error(
        "Error fetching users !",
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        }
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => setShowAddPopup(true);
  const handleEdit = (user) => setEditUser(user);
  const handleDelete = (id, username, role) => {
    setDeleteUserId(id);
    setDeleteUserUsername(username);
    setDeleteUserRole(role);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3004/${deleteUserRole.toLowerCase()}/delete`,
        {
          data: { id: deleteUserId },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.error(
        `Le ${deleteUserRole.toLowerCase()} ${deleteUserUsername.toUpperCase()} a été supprimé avec succès !`,
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        }
      );
      fetchUsers();
    } catch (err) {
      console.log(err.message);
    }
    setDeleteUserId(null);
    setDeleteUserRole(null);
    setDeleteUserUsername(null);
  };

  const handleAddUser = async (newUser) => {
    try {
      await saveUser(newUser); // envoie au backend
      const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([...users, { ...newUser, id }]);
      alert("Utilisateur ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert(
        "Échec de l'ajout : " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const res = await axios.put(
        `http://localhost:3004/${updatedUser.role.toLowerCase()}/update`,
        updatedUser,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchUsers();
      toast.info(
        `Le ${updatedUser.role.toLowerCase()} ${updatedUser.username.toUpperCase()} à été modifié par succès`,
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        }
      );
      
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAccessColor = (access) => "#ffffff";
  const getAccessTextColor = (access) =>
    access === "Active" ? "#0b4d03" : "#7c0000";
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "#000000";
      case "RESPONSABLE":
        return "#9d044cff";
      case "GESTIONNAIRE":
        return "#ff4cc6ff";
      case "VISITEUR":
        return "#45ed66ff";
      default:
        return "#eeeeee";
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "2000px",
        margin: "0",
        marginTop: "-20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          Gestion des profils:{" "}
          <FaPlus
            style={{ cursor: "pointer", color: hoveredPlus ? "green" : "#020144ff", width: 40 }}
            onClick={handleAdd}
            onMouseEnter={() => setHoveredPlus(true)}
            onMouseLeave={() => setHoveredPlus(false)}
          />
        </h2>
        <div style={{ position: "relative" }}>
          <FaSearch
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa",
            }}
          />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 10px 10px 35px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
              width: "250px",
            }}
          />
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "sans-serif",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#d9ceceff", height: "40px" }}>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Rôle</th>
            <th>Accès</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfiles.map((profile, index) => (
            <tr key={index} style={{ textAlign: "center", height: "50px" }}>
              <td>{profile.id}</td>
              <td>{profile.username}</td>
              <td>{profile.email}</td>
              <td>{profile.tel}</td>
              <td>{profile.addresse}</td>
              <td>
                <span
                  style={{
                    backgroundColor: getRoleColor(profile.role),
                    color: "#FFF",
                    padding: "6px 20px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    display: "inline-block",
                    width: "120px",
                  }}
                >
                  {profile.role}
                </span>
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  color: getAccessTextColor(profile.activation),
                }}
              >
                {profile.activation == "Active" ? "AUTORISÉ" : "NON AUTHORISÉ"}
              </td>
              <td>
                <button
                  onClick={() => handleEdit(profile)}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "none",
                    padding: "6px 10px",
                    marginRight: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredEdit(index)}
                  onMouseLeave={() => setHoveredEdit(null)}
                >
                  <FaEdit
                    style={{
                      color: hoveredEdit === index ? "orange" : "#080808ff",
                    }}
                  />
                </button>
                <button
                  onClick={() =>
                    handleDelete(profile.id, profile.username, profile.role)
                  }
                  style={{
                    backgroundColor: "#ffffff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredTrash(index)}
                  onMouseLeave={() => setHoveredTrash(null)}
                >
                  <FaTrash
                    style={{
                      color: hoveredTrash === index ? "red" : "#610202ff",
                    }}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popups */}
      {showAddPopup && (
        <AddUserPopup
          onClose={() => setShowAddPopup(false)}
          onAdd={handleAddUser}
          updateUsers={fetchUsers}
        />
      )}
      {editUser && (
        <EditUserPopup
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdate={handleUpdateUser}
        />
      )}
      {deleteUserId && (
        <ConfirmDeletePopup
          onConfirm={confirmDelete}
          onCancel={() => setDeleteUserId(null)}
          username={deleteUserUsername}
        />
      )}
    </div>
  );
};

export default GProfil;
