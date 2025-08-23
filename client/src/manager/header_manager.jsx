import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaHome, FaSearch, FaUserCircle } from "react-icons/fa";
import axios from "axios";

function ManagerDropdown({ userName, Email, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [hover, setHover] = useState(false)

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
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
          display: "flex",
          fontWeight: "bold",
          alignItems: "center",
          gap: "8px",
          color: "inherit",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {localStorage.getItem("userName")}
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
              {userName}
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

export default function Header_Manager() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchedClient, setMatchedClient] = useState(null);
  const [searched, setSearched] = useState([]);
  const managerData = {
    name: localStorage.getItem("userName") || "user",
    email: localStorage.getItem("Email") || "user@pbc.com",
  };
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  const buttons = [
    "AGENDA",
    "GESTION DU DOSSIER",
    "GESTION DES GESTIONNAIRES",
    "PILOTAGE DE COMMISSION",
  ];

  const handleNavigation = (label, index) => {
    setActive(index);
    switch (label) {
      case "AGENDA":
        navigate("/manager/agenda");
        break;
      case "GESTION DU DOSSIER":
        navigate("/manager/dossier");
        break;
      case "GESTION DES GESTIONNAIRES":
        navigate("/manager/gestionnaires");
        break;
      case "PILOTAGE DE COMMISSION":
        navigate("/manager/pilotage");
        break;
      default:
        break;
    }
  };

  const searchFor = async (s) => {
    setSearchTerm(s);
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/user/search/${s}`);
      setSearched(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleLogoClick = () => {
    navigate("/manager/agenda");
  };

  const handleLogout = async () => {
    try {
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
    localStorage.removeItem("userName");
    localStorage.removeItem("Email");
    localStorage.removeItem("Role");
    // localStorage.removeItem("token");
    navigate("/login");
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
      {/* Ligne supérieure */}
      <div
        style={{
          padding: "0.75rem 2rem",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={handleLogoClick}
        >
          <img src={logo} alt="Logo" style={{ height: "32px" }} />
        </div>

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
              navigate("/manager/agenda", { replace: true });
              // Forcer le rechargement de la page si on est déjà sur la page agenda
              if (location.pathname === "/manager/agenda") {
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

        <div
          style={{ display: "flex", alignItems: "center", justifySelf: "end" }}
        >
          <ManagerDropdown
            userName={localStorage.getItem("Role")}
            Email={localStorage.getItem("Email")}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* ✅ BARRE DE NAVIGATION – Style Admin conservé */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          background: "linear-gradient(to right, #300202ff, #510101ff)",
          padding: "0.5rem 1rem", // ✅ même que Header_Admin
        }}
      >
        {buttons.map((label, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(label, index)}
            style={{
              margin: "0 auto",
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
