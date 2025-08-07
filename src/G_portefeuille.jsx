import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast, Slide } from "react-toastify";

export default function G_Portefeuille() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repartitionAutomatique, setRepartitionAutomatique] = useState(false);
  const [selectedLot, setSelectedLot] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedMarche, setSelectedMarche] = useState("");
  const [managers, setManagers] = useState([]);
  const [lots, setLots] = useState([]);
  const [marches, setMarches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await axios.get(`http://localhost:3004/auth/admin`, {
          withCredentials: true,
        });
      } catch {
        navigate("/");
      }
    };

    const fetchData = async () => {
      try {
        const [resLots, resManagers, resMarche] = await Promise.all([
          axios.get("http://localhost:3004/parametrage/lots"),
          axios.get("http://localhost:3004/responsable/get"),
          axios.get("http://localhost:3004/parametrage/clients"),
        ]);
        setLots(resLots.data);
        setSelectedLot(resLots.data[0].id);
        setManagers(resManagers.data);
        setSelectedManager(resManagers.data[0].id);
        setMarches(resMarche.data);
        setSelectedMarche(resMarche.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };

    verifyUser();
    fetchData();
  }, []);

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
          setHeaders(Object.keys(jsonData[0]));
          setData(jsonData);
          toast.success("Fichier chargé avec succès!", { transition: Slide });
        }
      } catch {
        toast.error("Erreur lecture fichier", { transition: Slide });
      } finally {
        setFileLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleAffecterTaches = async () => {
    if (!data || data.length === 0) {
      toast.error("Veuillez charger un fichier.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        data,
        repartitionAutomatique,
        lot: selectedLot,
        manager: selectedManager,
        len: data.length,
        client: selectedMarche,
      };

      const res = await fetch("http://localhost:3004/import/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Les dossiers sont affectés avec succès");
      } else {
        const err = await res.json();
        toast.error(err.message || "Erreur serveur");
      }
    } catch (err) {
      toast.error(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: "#ffffffff",
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
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#6d0202ff",
            color: "white",
            border: "none",
            borderTopLeftRadius: "8px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          MARCHÉ
        </button>
        <button
          onClick={() => navigate("cadrage")}
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#E5E0D8",
            color: "#111",
            border: "none",
            borderTopRightRadius: "8px",
            fontWeight: "bold",
            margin: 0,
            marginLeft: "-1px",
          }}
        >
          CADRAGE
        </button>
      </div>

      {/* Formulaire d’importation */}
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
        <h2 style={{ textAlign: "center", color: "#6d0202ff", marginTop: "0"}}>
          Importer un fichier Excel - Marché
        </h2>

        <div style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500"}}>
          <label>Fichier Excel :</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={repartitionAutomatique}
            onChange={(e) => setRepartitionAutomatique(e.target.checked)}
          />{" "}
          Répartition automatique
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Marché :</label>
          <select
            value={selectedMarche}
            onChange={(e) => setSelectedMarche(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px" }}
          >
            {marches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.marche}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Manager :</label>
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px" }}
          >
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.username}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label>Lot :</label>
          <select
            value={selectedLot}
            onChange={(e) => setSelectedLot(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px" }}
          >
            {lots.map((l) => (
              <option key={l.id} value={l.id}>
                {l.Nlot}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAffecterTaches}
          disabled={loading || fileLoading}
          style={{
            width: "100%",
            backgroundColor: "#6d0202ff",
            color: "white",
            padding: "1rem",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: loading || fileLoading ? "not-allowed" : "pointer",
          }}
        >
          {loading || fileLoading ? "EN COURS..." : "AFFECTER"}
        </button>
      </div>
    </div>
  );
}
