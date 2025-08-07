import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast, Slide } from "react-toastify";

export default function Cadrage() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length > 0) {
          setData(jsonData);
          toast.success("Fichier chargé avec succès!", { transition: Slide });
        }
      } catch (err) {
        toast.error("Erreur lecture fichier", { transition: Slide });
      } finally {
        setFileLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleMiseEnPlace = async () => {
    if (!data || data.length === 0) {
      toast.error("Fichier vide ou non chargé");
      return;
    }

    if (!selectedType || !selectedStatut) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        data,
        typeCadrage: selectedType,
        statut: selectedStatut,
      };

      const res = await fetch("http://localhost:3004/import/cadrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Données cadrage envoyées");
      } else {
        const err = await res.json();
        toast.error(err.message || "Erreur serveur");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: "rgba(255, 255, 255, 1)",
        padding: "2rem",
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
      }}
    >
      {/* Spinner loading */}
      {(fileLoading || loading) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #ccc",
              borderTop: "4px solid #6d0202ff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "1rem",
            }}
          />
          <p style={{ color: "white", fontWeight: "bold" }}>
            {fileLoading ? "Chargement du fichier..." : "Envoi en cours..."}
          </p>
        </div>
      )}

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Onglets Marché / Cadrage */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "0rem",
          marginLeft: "20rem",
        }}
      >
        <button
          onClick={() => navigate("/admin/portefeuille")}
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#E5E0D8",
            color: "#111",
            border: "none",
            borderTopLeftRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          MARCHÉ
        </button>
        <button
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#6d0202ff",
            color: "white",
            border: "none",
            borderTopRightRadius: "8px",
            fontWeight: "bold",
          }}
        >
          CADRAGE
        </button>
      </div>

      {/* Formulaire d'importation */}
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#6d0202ff", marginTop: "0" }}>
          Importer un fichier Excel - Cadrage
        </h2>
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Fichier Excel :
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              
            }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Type de cadrage :
          </label>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              width: "100%", padding: "0.5rem", borderRadius: "6px"
            }}
          >
            <option value="">Sélectionnez un type</option>
            <option value="Téléphonique">Téléphonique</option>
            <option value="CNSS">CNSS</option>
            <option value="Patrimoine">Patrimoine</option>
          </select>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Marche :
          </label>
          <select
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "6px",
            }}
          >
            <option value="">Sélectionnez un marche</option>
            <option value="CIH">CIH</option>
            <option value="Marché 2">Marché 2</option>
          </select>
        </div>

       

        <button
          onClick={handleMiseEnPlace}
          disabled={!selectedType || !selectedStatut || data.length === 0 || loading}
          style={{
            width: "100%",
            backgroundColor: "#460202c2",
            color: "white",
            padding: "1rem",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: !selectedType || !selectedStatut || data.length === 0 ? "not-allowed" : "pointer",
            opacity: !selectedType || !selectedStatut || data.length === 0 ? 0.7 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            if (selectedType && selectedStatut && data.length > 0 && !loading) {
              e.target.style.opacity = "0.9";
            }
          }}
          onMouseOut={(e) => {
            if (selectedType && selectedStatut && data.length > 0) {
              e.target.style.opacity = "1";
            }
          }}
        >
          {loading ? "TRAITEMENT EN COURS..." : "Affecter le cadrage"}
        </button>
      </div>
    </div>
  );
}
