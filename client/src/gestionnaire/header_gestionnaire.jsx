import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaHome, FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";

function GestionnaireDropdown({
  gestionnaireName,
  gestionnaireEmail,
  onLogout,
}) {
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
          alignItems: "center",
          gap: "8px",
          color: "inherit",
          fontWeight: "bold",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {localStorage.getItem("userName") || "GESTIONNAIRE"}
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
              {localStorage.getItem("Role")}
            </h3>
            <p
              style={{ fontSize: "13px", color: "#6b7280", fontWeight: "400" }}
            >
              {localStorage.getItem("Email")}
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

export default function Header_Gestionnaire() {
  const location = useLocation();
  const [active, setActive] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchedClient, setMatchedClient] = useState(null);

  const gestionnaireData = {
    name: localStorage.getItem("gestionnaireName") || "Gestionnaire",
    email: localStorage.getItem("gestionnaireEmail") || "gestionnaire@pbc.com",
  };

  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [notif, setNotif] = useState([]);
  const [showBadge, setShowBadge] = useState(true);
  const [sound, setSound] = useState(true);
  const audioRef = useRef(null);
  const [searched, setSearched] = useState([]);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  // Add ref to track previous notifications for comparison
  const prevNotifRef = useRef([]);

  useEffect(() => {
    audioRef.current = new Audio("/notif.wav");
  }, []);

  useEffect(() => {
    socketRef.current = io(`http://${HOST}:${PORT}`);
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("✅ Notif Connected to socket server:", socket.id);
      socket.emit("Notif", Number(localStorage.getItem("UserId")));
    };

    const handleData = ({ userId, notifs }) => {
      console.log("UsersId : ", localStorage.getItem("UserId"));
      if (userId == localStorage.getItem("UserId")) {
        console.log("📦 Received Notifications:", notifs);

        const reversedNotifs = notifs.slice().reverse();

        // Check if there are genuinely new notifications
        // Compare with previous notifications to detect new ones
        const hasNewNotifications = () => {
          const prevNotifs = prevNotifRef.current;

          // If no previous notifications, and we have notifications now, they're new
          if (prevNotifs.length === 0 && reversedNotifs.length > 0) {
            return reversedNotifs.some((notif) => !notif.isRead);
          }

          // Check if there are more notifications than before
          if (reversedNotifs.length > prevNotifs.length) {
            // Get the new notifications (the ones that weren't in previous list)
            const newNotifs = reversedNotifs.slice(
              0,
              reversedNotifs.length - prevNotifs.length
            );
            return newNotifs.some((notif) => !notif.isRead);
          }

          return false;
        };

        // Play sound only for genuinely new unread notifications
        if (audioRef.current && sound && hasNewNotifications()) {
          audioRef.current.play().catch((err) => {
            console.log("Audio play error:", err);
          });
        }

        // Update the previous notifications reference
        prevNotifRef.current = reversedNotifs;

        setNotif(reversedNotifs);
        setShowBadge(true);
      }
    };

    const handleError = (errMsg) => {
      console.error("❌ Error received:", errMsg);
      setError(errMsg);
    };

    // Listen to socket events
    socket.on("connect", handleConnect);
    socket.on("Notification", handleData);
    socket.on("NotifictaionError", handleError);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("Notification", handleData);
      socket.off("NotifictaionError", handleError);
    };
  }, [sound]); // Add sound to dependencies

  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const dropdownRefNotif = useRef(null);

  // Calculate unread count - only show if showBadge is true
  let unreadCount = showBadge
    ? notif?.filter((notification) => !notification.isRead).length || 0
    : 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefNotif.current &&
        !dropdownRefNotif.current.contains(event.target)
      ) {
        setIsOpenNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdownNotif = async () => {
    setIsOpenNotif(!isOpenNotif);
    setTimeout(() => {
      // setShowBadge(false); // Hide badge after 7 seconds
    }, 7000);

    try {
      const res = await axios.get(
        `http://${HOST}:${PORT}/readNotif/${localStorage.getItem("UserId")}`,
        {
          withCredentials: true,
        }
      );
      // Disable sound temporarily when marking as read
      setSound(false);
      // Re-enable sound after a short delay
      setTimeout(() => setSound(true), 1000);
    } catch (err) {
      console.log(err.message);
    }

    if (!isOpenNotif) {
      setShowBadge(false);
    }
  };

  const buttons = [
    "AGENDA",
    "GESTION DU DOSSIER",
    "MES ENCAISSEMENTS",
    "PILOTAGE DE COMMISSION",
  ];

  const searchFor = async (s) => {
    setSearchTerm(s);
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/user/search/${s}`);
      setSearched(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleNavigation = (label, index) => {
    setActive(index);
    switch (label) {
      case "AGENDA":
        navigate("/gestionnaire/agenda");
        break;
      case "GESTION DU DOSSIER":
        console.log("Gestion du dossier");
        navigate("/gestionnaire/GDossier");
        break;
      case "PILOTAGE DE COMMISSION":
        navigate("/gestionnaire/pilotage");
        break;
      case "MES ENCAISSEMENTS":
        navigate("/gestionnaire/mesencaissements");
      default:
        break;
    }
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
    localStorage.removeItem("gestionnaireName");
    localStorage.removeItem("gestionnaireEmail");
    localStorage.removeItem("gestionnaireRole");
    localStorage.removeItem("token");
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
        <div style={{ display: "flex", alignItems: "center" }}>
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
              navigate("/gestionnaire/agenda", { replace: true });
              // Forcer le rechargement de la page si on est déjà sur la page agenda
              if (location.pathname === "/gestionnaire/agenda") {
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
          style={{
            display: "flex",
            alignItems: "center",
            justifySelf: "end",
            position: "relative",
          }}
          ref={dropdownRefNotif}
        >
          {/* Notification Bell with Badge */}
          <div style={{ position: "relative", marginRight: "12px" }}>
            <FaBell
              size={20}
              onClick={toggleDropdownNotif}
              style={{
                cursor: "pointer",
                color: "rgba(184, 143, 143, 1)",
              }}
            />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontSize: "10px",
                  borderRadius: "50%",
                  height: "18px",
                  width: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {unreadCount > 10 ? "10+" : unreadCount}
              </span>
            )}
          </div>

          {/* Notification Dropdown */}
          {isOpenNotif && (
            <div
              style={{
                position: "absolute",
                top: "35px",
                right: "0",
                width: "320px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                zIndex: 1001,
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                    margin: "0 0 4px 0",
                  }}
                >
                  Notifications
                </h3>
              </div>

              {/* Notifications List */}
              <div
                style={{
                  maxHeight: "384px",
                  overflowY: "auto",
                }}
              >
                {notif?.length === 0 || !notif ? (
                  <div
                    style={{
                      padding: "32px 16px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <FaBell
                      style={{
                        fontSize: "24px",
                        opacity: 0.5,
                        marginBottom: "8px",
                      }}
                    />
                    <p style={{ margin: "0" }}>Aucune notification</p>
                  </div>
                ) : (
                  notif.map((n, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f3f4f6",
                        backgroundColor: n.isRead ? "#ffffff" : "#b91c1c",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = n.isRead
                          ? "#f3f4f6"
                          : "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = n.isRead
                          ? "#ffffff"
                          : "#b91c1c";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: n.isRead ? "#9ca3af" : "#f87171",
                            marginTop: "8px",
                            flexShrink: 0,
                            transition: "background-color 0.3s ease",
                          }}
                        ></div>
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontSize: "14px",
                              fontWeight: n.isRead ? "bold" : "bolder",
                              color: n.isRead ? "#1d1f22ff" : "#ffffff",
                              margin: "0 0 4px 0",
                              transition: "color 0.3s ease",
                            }}
                          >
                            {n.title}
                          </h4>
                          <p
                            style={{
                              fontSize: "14px",
                              color: n.isRead ? "#6b7280" : "#ffe4e6",
                              margin: "0 0 4px 0",
                              transition: "color 0.3s ease",
                            }}
                          >
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
            </div>
          )}

          <GestionnaireDropdown
            gestionnaireName={gestionnaireData.name}
            gestionnaireEmail={gestionnaireData.email}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* BARRE DE NAVIGATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "arround",
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
