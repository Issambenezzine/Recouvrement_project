import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";
import moment from "moment";

export default function Cadrage() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatut, setSelectedStatut] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [client, setClient] = useState([]);
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  const navigate = useNavigate();

  // Function to automatically detect cadrage type based on columns
  const detectCadrageType = (columns) => {
    // Convert column names to uppercase and trim for comparison
    const normalizedColumns = columns.map((col) =>
      typeof col === "string"
        ? col.toUpperCase().trim()
        : String(col).toUpperCase().trim()
    );

    console.log("Normalized columns:", normalizedColumns);

    // Check for address columns (ADRESSE, VILLE)
    if (
      normalizedColumns.includes("ADRESSE") &&
      normalizedColumns.includes("VILLE")
    ) {
      return "Cadrage Addresse";
    }

    // Check for employer columns (AD STE, V STE)
    if (
      normalizedColumns.includes("AD STE") &&
      normalizedColumns.includes("V STE")
    ) {
      return "Cadrage Employeur";
    }

    // Check for telephone columns (Tel 1, Tel 2)
    if (
      normalizedColumns.includes("TEL 1") &&
      normalizedColumns.includes("TEL 2")
    ) {
      return "Cadrage Téléphonique";
    }

    // Check for bank columns (RIB, solde)
    if (
      normalizedColumns.includes("RIB") &&
      normalizedColumns.includes("SOLDE")
    ) {
      return "Cadrage Banque";
    }

    // Default to Patrimoins if no specific pattern matches
    return "Cadrage Patrimoins";
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Read the Excel file
        const workbook = XLSX.read(event.target.result, { type: "binary" });

        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON array of objects using headers from first row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "", // Default value for empty cells
          // header: 1 is the default, so first row becomes object keys
        });

        // Remove completely empty rows
        const filteredData = jsonData.filter((row) =>
          Object.values(row).some(
            (cell) => cell !== "" && cell !== null && cell !== undefined
          )
        );

        if (filteredData.length > 0) {
          setData(filteredData);

          // Get column names from the first row
          const columns = Object.keys(filteredData[0]);

          // Automatically detect and set the cadrage type
          const detectedType = detectCadrageType(columns);
          setSelectedType(detectedType);

          console.log(
            "Excel data converted to array of objects:",
            filteredData
          );
          console.log("Sample object structure:", filteredData[0]);
          console.log("Detected columns:", columns);
          console.log("Auto-detected cadrage type:", detectedType);

          toast.success(`Fichier chargé avec succès!`, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Slide,
          });
          toast.success(`Type détecté automatiquement: ${detectedType}`, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Slide,
          });
        } else {
          alert("Le fichier est vide ou ne contient pas de données valides.");
        }
      } catch (err) {
        console.error("Erreur lors de la lecture du fichier:", err);
        alert("Erreur lors de la lecture du fichier Excel.");
      } finally {
        setFileLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const trimDataValues = (data) => {
    return data.map((row) => {
      const trimmedRow = {};

      Object.keys(row).forEach((key) => {
        let value = row[key];

        // Handle different data types
        if (typeof value === "string") {
          // Trim whitespace from strings
          value = value.trim();
        } else if (value instanceof Date) {
          // Handle Date objects - convert to ISO string and trim
          value = value.toISOString().trim();
        } else if (typeof value === "number" && !isNaN(value)) {
          // Check if it's an Excel date serial number
          if (value > 25000 && value < 50000) {
            // Convert Excel serial date to JavaScript Date, then to ISO string
            const excelDate = new Date((value - 25569) * 86400 * 1000);
            value = excelDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
          }
        } else if (value !== null && value !== undefined) {
          // Convert other types to string and trim
          value = String(value).trim();
        }

        trimmedRow[key] = value;
      });

      return trimmedRow;
    });
  };
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(
          `http://${HOST}:${PORT}/parametrage/clients`
        );
        setClient(res.data.filter(r => r.visibility === 1) || []);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchClient();
  }, []);

  const handleMiseEnPlace = async () => {
    if (!data || data.length === 0) {
      alert("Fichier vide ou non chargé");
      return;
    }

    if (!selectedType || !selectedStatut) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);

      // Trim all text and date values before sending
      const trimmedData = trimDataValues(data);

      const payload = {
        data: trimmedData,
        type: selectedType,
        marche: selectedStatut,
      };

      console.log("Original data:", data);
      console.log("Trimmed data:", trimmedData);

      const res = await axios.post(
        `http://${HOST}:${PORT}/import/cadrage`,
        payload
      );

      console.log("Données envoyées avec succès:", res.data);
      toast.success(`${selectedType} effectué avec succès`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);

      let errorMessage = "Une erreur est survenue";
      if (err.response) {
        // Server responded with an error
        errorMessage =
          err.response.data?.message || err.response.data || errorMessage;
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Pas de réponse du serveur";
      } else {
        // Error setting up request
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e9e6e69c",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        fontFamily: "Segoe UI, sans-serif",
        marginTop: "-40px",
        marginLeft: "-10px",
        marginRight: "-10px",
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
              borderTop: "4px solid #8b2635",
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

      {/* Container for centered content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "100vh",
          paddingTop: "4rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 2rem",
          }}
        >
          {/* Onglets Marché / Cadrage */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "0",
              width: "100%",
            }}
          >
            <button
              onClick={() => navigate("/admin/portefeuille")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#e8e4dc",
                color: "#333",
                border: "none",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "0",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                letterSpacing: "0.5px",
              }}
            >
              MARCHÉ
            </button>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#8b2635",
                color: "white",
                border: "none",
                borderTopLeftRadius: "0",
                borderTopRightRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                letterSpacing: "0.5px",
              }}
            >
              CADRAGE
            </button>
          </div>

          {/* Formulaire d'importation */}
          <div
            style={{
              backgroundColor: "white",
              padding: "2.5rem",
              borderRadius: "0 8px 8px 8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#333",
                marginTop: "0",
                marginBottom: "2rem",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Importer un fichier Excel - Cadrage
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                Fichier (.xls, .xlsx, .csv)
              </label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#fafafa",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                Type de cadrage :
              </label>
              <input
                type="text"
                value={selectedType}
                readOnly
                placeholder="Le type sera détecté automatiquement lors du chargement du fichier"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#f8f9fa",
                  cursor: "not-allowed",
                  color: selectedType ? "#333" : "#999",
                }}
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                Marché :
              </label>
              <select
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                }}
              >
                <option value="">Sélectionnez un marché</option>
                {client.map((client, index) => (
                  <option key={index} value={client.id}>
                    {client.marche}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleMiseEnPlace}
              disabled={
                !selectedType || !selectedStatut || data.length === 0 || loading
              }
              style={{
                width: "100%",
                backgroundColor:
                  !selectedType ||
                  !selectedStatut ||
                  data.length === 0 ||
                  loading
                    ? "#ccc"
                    : "#8b2635",
                color: "white",
                padding: "14px",
                border: "none",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "14px",
                letterSpacing: "0.5px",
                cursor:
                  !selectedType ||
                  !selectedStatut ||
                  data.length === 0 ||
                  loading
                    ? "not-allowed"
                    : "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => {
                if (
                  selectedType &&
                  selectedStatut &&
                  data.length > 0 &&
                  !loading
                ) {
                  e.target.style.backgroundColor = "#6d1f29";
                }
              }}
              onMouseOut={(e) => {
                if (
                  selectedType &&
                  selectedStatut &&
                  data.length > 0 &&
                  !loading
                ) {
                  e.target.style.backgroundColor = "#8b2635";
                }
              }}
            >
              {loading ? "TRAITEMENT EN COURS..." : "AFFECTER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
