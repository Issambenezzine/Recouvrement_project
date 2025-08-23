import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./assets/logo.png";
import { FaHome, FaSearch, FaUserCircle } from "react-icons/fa";
import axios from "axios";

// Composant AdminDropdown
function AdminDropdown({ userName, Email, onLogout, role }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [hoverUsername, setHoverUsername] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      ref={dropdownRef}
    >
      <FaUserCircle size={22} color="#000" />
      <button
        style={{
          background: "none",
          fontWeight: "bold",
          color: hoverUsername ? "#3b0000ff" : "black",
          transition: "0.2s",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          // color: "inherit",
        }}
        onMouseEnter={() => setHoverUsername(true)}
        onMouseLeave={() => setHoverUsername(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {userName}
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            marginTop: "8px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1px solid #e5e7eb",
            minWidth: "220px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            <h3
              style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}
            >
              {role}
            </h3>
            <p
              style={{ fontSize: "13px", color: "#6b7280", fontWeight: "400" }}
            >
              {Email}
            </p>
          </div>
          <button
            style={{
              background: hover ? "#e81414ff" : "none",
              color: hover ? "white" : "inherit",
              border: "none",
              padding: "8px 12px",
              width: "100%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onLogout}
          >
            <span>↪</span> Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header_Admin(onClickHome, data) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(0);
  const [searched, setSearched] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const adminData = {
    name: localStorage.getItem("userName") || "user",
    email: localStorage.getItem("Email") || "user@pbc.com",
  };

  const buttons =
    localStorage.getItem("Role") === "ADMIN"
      ? [
          "AGENDA",
          "GESTION DU PORTEFEUILLE",
          "GESTION DU DOSSIER",
          "GESTION DES ENCAISSEMENTS",
          "GESTION DES DÉBITEURS",
          "GESTION DU PROFIL",
          "PILOTAGE COMMISSION",
          "PARAMÉTRAGE",
        ]
      : [
          "AGENDA",
          "GESTION DU DOSSIER",
          "GESTION DES ENCAISSEMENTS",
          "GESTION DU PROFIL",
          "GESTION DES DÉBITEURS",
          "PILOTAGE COMMISSION",
        ];

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/agenda")) setActive(0);
    else if (path.includes("/portefeuille")) setActive(1);
    else if (
      path.includes("/dossier") &&
      localStorage.getItem("Role") === "ADMIN"
    )
      setActive(2);
    else if (
      path.includes("/dossier") &&
      localStorage.getItem("Role") === "VISITEUR"
    )
      setActive(1);
    else if (
      path.includes("/encaissement") &&
      localStorage.getItem("Role") === "ADMIN"
    )
      setActive(3);
    else if (
      path.includes("/encaissement") &&
      localStorage.getItem("Role") === "VISITEUR"
    )
      setActive(2);
    else if (
      path.includes("/debiteurs") &&
      localStorage.getItem("Role") === "ADMIN"
    )
      setActive(4);
    else if (
      path.includes("/debiteurs") &&
      localStorage.getItem("Role") === "VISITEUR"
    )
      setActive(4);
    else if (
      path.includes("/profil") &&
      localStorage.getItem("Role") === "ADMIN"
    )
      setActive(5);
    else if (
      path.includes("/profil") &&
      localStorage.getItem("Role") === "VISITEUR"
    )
      setActive(3);
    else if (
      path.includes("/pilotage") &&
      localStorage.getItem("Role") === "ADMIN"
    )
      setActive(6);
    else if (
      path.includes("/pilotage") &&
      localStorage.getItem("Role") === "VISITEUR"
    )
      setActive(5);
    else if (path.includes("/parametrage")) setActive(7);
  }, [location.pathname]);

  const handleNavigation = (label, index) => {
    setActive(index);
    switch (label) {
      case "AGENDA":
        navigate("/admin/agenda");
        break;
      case "GESTION DU DOSSIER":
        navigate("/admin/dossier");
        break;
      case "GESTION DU PORTEFEUILLE":
        navigate("/admin/portefeuille");
        break;
      case "GESTION DES ENCAISSEMENTS":
        navigate("/admin/encaissement");
        break;
      case "GESTION DES DÉBITEURS":
        navigate("/admin/debiteurs");
        break;
      case "GESTION DU PROFIL":
        navigate("/admin/profil");
        break;
      case "PILOTAGE COMMISSION":
        navigate("/admin/pilotage");
        break;
      case "PARAMÉTRAGE":
        navigate("/admin/parametrage");
        break;
      default:
        break;
    }
  };

  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  const handleLogout = async () => {
    try {
      // Si tu veux supprimer aussi le cookie côté serveur (optionnel)
      await axios.post(
        `http://${HOST}:${PORT}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.warn("Erreur logout serveur (non bloquante)", error);
    }

    // Suppression des données du localStorage
    localStorage.removeItem("Role");
    localStorage.removeItem("userName");
    localStorage.removeItem("Email");
    localStorage.removeItem("token"); // si tu enregistres le token
    navigate("/login");
  };

  const handleLogoClick = () => {
    navigate("/admin/agenda");
  };

  const [matchedClient, setMatchedClient] = useState(null);

  const searchFor = async (s) => {
    setSearchTerm(s);
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/user/search/${s}`);
      setSearched(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div
      style={{
        backgroundColor: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: "0.75rem 2rem",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={handleLogoClick}
        >
          <img src={logo} alt="Logo" style={{ height: "32px" }} />
        </div>

        {/* Barre de recherche avec FaHome */}
        <div
          style={{
            justifySelf: "center",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            position: "relative",
          }}
        >
          <button
            onClick={() => {
              navigate("/admin/agenda", { replace: true });
              // Forcer le rechargement de la page si on est déjà sur la page agenda
              if (location.pathname === "/admin/agenda") {
                window.location.reload();
              }
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.4rem",
            }}
            title="Accueil"
          >
            <FaHome style={{ fontSize: "18px", color: "#3b0000ff" }} />
          </button>

          <div style={{ position: "relative", width: "300px" }}>
            <FaSearch
              style={{
                position: "absolute",
                top: "50%",
                right: "-40px",
                transform: "translateY(-50%)",
                color: "#6b7280",
                fontSize: "14px",
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => searchFor(e.target.value)}
              placeholder="Rechercher ..."
              style={{
                width: "100%",
                padding: "6px 18px 6px 36px",
                borderRadius: 24,
                border: "none",
                background: "#cfc7c7ae",
                fontSize: 16,
              }}
            />
            {searchTerm.trim() !== "" && searched.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  padding: "12px",
                  zIndex: 1000,
                  gap: "1.5rem",
                  maxHeight: "400px",
                  overflowY: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                {searched.map((matchedClient, index) => (
                  <div key={index}>
                    <span>
                      <strong>Client :</strong> {matchedClient.client + " / "}
                    </span>
                    <span>
                      <strong>Débiteur :</strong>{" "}
                      {matchedClient.debiteur + " / "}
                    </span>
                    <span>
                      <strong>CIN :</strong> {matchedClient.piece + " / "}
                    </span>
                    <span>
                      <strong>Gestionnaire :</strong>{" "}
                      {matchedClient.gestionnaire + "  "}
                    </span>
                    <div
                      style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        borderBottom: "1px solid #ccc",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Dropdown */}
        <div
          style={{ display: "flex", alignItems: "center", justifySelf: "end" }}
        >
          <AdminDropdown
            userName={localStorage.getItem("userName")}
            role={localStorage.getItem("Role")}
            Email={localStorage.getItem("Email")}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Barre de navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          overflowX: "auto",
          background: "linear-gradient(to right, #300202ff, #510101ff)",
          padding: "0.5rem 1rem",
        }}
      >
        {buttons.map((label, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(label, index)}
            style={{
              padding: "0.5rem 0.6rem",
              marginRight: "1rem",
              fontSize: "0.65rem",
              backgroundColor: active === index ? "#fefbfbff" : "transparent",
              color: active === index ? "#111" : "#fff",
              borderRadius: "1.2rem",
              border: "none",
              cursor: "pointer",
              fontWeight: active === index ? 700 : 500,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
