
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BackgroundImage from "./assets/new_background.png";

axios.defaults.withCredentials = true;

const getBackgroundStyle = () => ({
  position: "fixed",
  inset: 0,
  background: `url(${BackgroundImage}) center center / cover no-repeat`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Segoe UI",
  zIndex: 0,
});

const logoImgStyle = {
  position: "absolute",
  top: 24,
  left: 32,
  height: 90,
  zIndex: 2,
  userSelect: "none",
};

const containerStyle = {
  background: "rgba(86, 20, 5, 0.55)",
  borderRadius: 24,
  boxShadow: "0 8px 32px rgba(123, 33, 27, 0.37)",
  padding: "48px 36px",
  minWidth: 350,
  maxWidth: 400,
  width: "90%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 1,
  margin: "0 auto",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(12px)",
};

const titleStyle = {
  color: "#fff",
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 32,
  textAlign: "center",
};

const labelStyle = {
  color: "#fff",
  fontWeight: 500,
  marginBottom: 8,
  marginTop: 12,
  alignSelf: "flex-start",
};

const inputStyle = {
  width: "100%",
  borderRadius: 8,
  border: "2px solid #e0e0e0",
  outline: "none",
  fontSize: 15,
  background: "#fff",
  color: "#333",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  padding: "12px 16px",
  transition: "all 0.3s ease",
  boxSizing: "border-box",
};

const inputPasswordWrapper = {
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
};

const eyeIconStyle = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "#666",
  padding: "8px",
  borderRadius: "50%",
};

const buttonBaseStyle = {
  width: "100%",
  padding: "12px 0",
  borderRadius: 10,
  border: "none",
  background: "rgba(253, 244, 244, 0.93)",
  color: "#222",
  fontWeight: 700,
  fontSize: 16,
  marginTop: 10,
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(60,60,100,0.09)",
  transition: "background 0.2s, color 0.2s",
};

const errorTextStyle = {
  color: "red",
  fontSize: "12px",
  marginTop: "4px",
  alignSelf: "flex-start",
  fontWeight: "bold"
};

export default function Login() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldError, setFieldError] = useState({ email: "", password: "" });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();

    setFieldError({ email: "", password: "" });
    setErrorMessage("");

    let hasError = false;
    if (!email) {
      setFieldError((prev) => ({ ...prev, email: "* Veuillez entrer votre e-mail." }));
      hasError = true;
    }
    if (!password) {
      setFieldError((prev) => ({ ...prev, password: "* Veuillez entrer votre mot de passe." }));
      hasError = true;
    }
    if (hasError) return;

    try {
      const res = await axios.post(
        "http://localhost:3004/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { role, name, email: userEmail, id } = res.data;

      localStorage.setItem("Role", role);
      localStorage.setItem("UserId", id);
      localStorage.setItem("userName", name);
      localStorage.setItem("Email", userEmail);

      switch (role) {
        case "ADMIN":
          navigate("/admin/agenda");
          break;
        case "GESTIONNAIRE":
          navigate("/gestionnaire/agenda");
          break;
        case "RESPONSABLE":
          navigate("/manager/agenda");
          break;
        case "VISITEUR":
          navigate("/visiteur/agenda");
          break;
        default:
          setErrorMessage("Rôle non reconnu !");
      }
    } catch (err) {
      console.error("Erreur de connexion :", err);
      if (err.response?.data?.message) {
        if(err.response.data.message === "Vous n'êtes pas autorisé") {
          navigate("/block")
        }else {
          setErrorMessage(err.response.data.message);
        }
      } else {
        setErrorMessage("Erreur serveur ou réseau. Veuillez réessayer.");
      }
    }
  };

  return (
    <div style={getBackgroundStyle()}>
      <img src={logo} alt="Logo PBC" style={logoImgStyle} />
      <form style={containerStyle} onSubmit={handleLogin}>
        <div style={titleStyle}>Bienvenue, identifiez-vous pour continuer.</div>

        <label style={labelStyle} htmlFor="email">E-mail</label>
        <input
          style={inputStyle}
          type="email"
          id="email"
          placeholder="Saisir votre e-mail"
          autoComplete="username"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldError((prev) => ({ ...prev, email: "" }));
            setErrorMessage("");
          }}
        />
        {fieldError.email && <div style={errorTextStyle}>{fieldError.email}</div>}

        <label style={labelStyle} htmlFor="password">Mot de passe</label>
        <div style={inputPasswordWrapper}>
          <input
            style={inputStyle}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Saisir votre mot de passe"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldError((prev) => ({ ...prev, password: "" }));
              setErrorMessage("");
            }}
          />
          <span onClick={toggleShowPassword} style={eyeIconStyle}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {fieldError.password && <div style={errorTextStyle}>{fieldError.password}</div>}

        {errorMessage && (
          <div style={{ ...errorTextStyle, textAlign: "center", marginTop: "12px", color: "red" }}>
            * {errorMessage}
          </div>
        )}

        <div style={{ height: "2rem" }}></div>
        <button
          type="submit"
          style={{
            ...buttonBaseStyle,
            background: isButtonHovered ? "#a83a07" : buttonBaseStyle.background,
            color: isButtonHovered ? "#fff" : buttonBaseStyle.color,
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          SE CONNECTER
        </button>
      </form>
    </div>
  );
}