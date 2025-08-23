import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";

export default function G_Portefeuille() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false); // New state for file upload loading
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [repartitionAutomatique, setRepartitionAutomatique] = useState(0);
  const [selectedLot, setSelectedLot] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedMarche, setSelectedMarche] = useState("");
  const [managers, setManagers] = useState([]);
  const [lots, setLots] = useState([]);
  const [importMode, setImportMode] = useState("marché");
  const [marches, setMarche] = useState([]);
  const [selectedType, setSelectedType] = useState();
  const [selectedStatut, setSelectedStatut] = useState();
  const navigate = useNavigate()
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  const dateColumns = [
    "Date Première Échéance",
    "Date Dernière Échéance",
    "Date Contentieux",
    "Débiteur Date Naissance",
  ];

    const verifyUser = async () => {
    try {
      console.log("verifyUser called of role :",localStorage.getItem("Role"))
      const res = await axios.get(
        `http://${HOST}:${PORT}/auth/admin`,
        { withCredentials: true }
      );
    } catch (err) {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyUser()
  },[])


  useEffect(() => {
    const fetchLots = async () => {
      try {
        const resLots = await axios.get(
          `http://${HOST}:${PORT}/parametrage/lots`
        );
        setLots(resLots.data.filter(lot => lot.visibility === 1) || []);
        setSelectedLot(resLots.data[0].id || []);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchManagers = async () => {
      try {
        const resManagers = await axios.get(
          `http://${HOST}:${PORT}/responsable/get`
        );
        setManagers(resManagers.data);
        setSelectedManager(resManagers.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchMarche = async () => {
      try {
        const resMarche = await axios.get(
          `http://${HOST}:${PORT}/parametrage/clients`
        );
        setMarche(resMarche.data.filter((c) => c.visibility === 1));
        setSelectedMarche(resMarche.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLots();
    fetchManagers();
    fetchMarche();
  }, []);

  // Function to check if a column should be treated as a date column (with flexible matching)
  const isDateColumn = (columnName) => {
    const cleanColumnName = columnName.trim();
    return dateColumns.some(
      (dateCol) =>
        cleanColumnName === dateCol ||
        cleanColumnName.includes("Date Naissance") ||
        cleanColumnName.includes("Date Première") ||
        cleanColumnName.includes("Date Dernière") ||
        cleanColumnName.includes("Date Contentieux")
    );
  };

  // Function to check if a value is a potential Excel date number
  const isExcelDateNumber = (value) => {
    return typeof value === "number" && value > 25569 && value < 2958466; // Excel date range
  };

  // Function to convert Excel date number to dd/MM/yyyy format
  const convertExcelDateToString = (excelDate) => {
    try {
      const date = XLSX.SSF.parse_date_code(excelDate);
      if (date && date.y && date.m && date.d) {
        const day = date.d.toString().padStart(2, "0");
        const month = date.m.toString().padStart(2, "0");
        const year = date.y.toString();
        return `${day}/${month}/${year}`;
      }
      return excelDate.toString();
    } catch (error) {
      return excelDate.toString();
    }
  };

  // Function to process data and convert dates only for specific columns
  const processDataWithDates = (rawData) => {
    return rawData.map((row) => {
      const processedRow = {};
      Object.keys(row).forEach((key) => {
        const value = row[key];
        // Debug logging to see what we're processing
        if (key.includes("Naissance")) {
          console.log(`Processing ${key}: ${value} (type: ${typeof value})`);
        }
        // Only convert to date if it's a designated date column AND it's an Excel date number
        if (isDateColumn(key) && isExcelDateNumber(value)) {
          console.log(`Converting ${key}: ${value} to date`);
          processedRow[key] = convertExcelDateToString(value);
        } else {
          processedRow[key] = value;
        }
      });
      return processedRow;
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileLoading(true); // Start file loading
    setMessage("Chargement du fichier..."); // Set loading message

    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let workbook;
        if (isCSV) {
          // For CSV, read as text and parse as CSV
          const csvData = event?.target?.result;
          workbook = XLSX.read(csvData, { type: "string" });
        } else {
          // For Excel, read as binary with cellDates option
          workbook = XLSX.read(event?.target?.result, {
            type: "binary",
            cellDates: false, // Keep as numbers so we can detect and convert them
            cellNF: false,
            cellText: false,
          });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Get all rows as arrays to extract all headers
        const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let allHeaders = [];
        if (
          Array.isArray(allRows) &&
          allRows.length > 0 &&
          Array.isArray(allRows[0])
        ) {
          allHeaders = Array.from(new Set(allRows[0].map((h) => String(h))));
        }

        // Get data as objects, letting XLSX use the first row as headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length > 0) {
          // Process the data to convert Excel date numbers to dd/MM/yyyy format
          const processedData = processDataWithDates(jsonData);

          setHeaders(allHeaders);
          setData(processedData);
          setMessage("Fichier chargé avec succès!");
          
          // Show success toast for file upload
          toast.success("Fichier Excel/CSV chargé avec succès!", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Slide,
          });
        }
      } catch (error) {
        setMessage("Erreur lors de la lecture du fichier: " + (error?.message || String(error)));
        toast.error("Erreur lors du chargement du fichier", {
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
        setFileLoading(false); // End file loading
      }
    };

    reader.onerror = () => {
      setMessage("Erreur lors de la lecture du fichier");
      setFileLoading(false);
      toast.error("Erreur lors du chargement du fichier", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
      });
    };

    if (isCSV) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAffecterTaches = async () => {
    try {
      setLoading(true);
      setMessage("Envoi des données au serveur...");

      // Check for empty data array
      if (!data || data.length === 0) {
        toast.error("Fichier Excel/CSV introuvable", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
        });
        setLoading(false);
        return;
      }

      // Construct payload
      const payLoad = {
        data,
        repartitionAutomatique,
        lot: selectedLot,
        manager: selectedManager,
        len: data.length,
        client: selectedMarche,
      };

      // Send request
      const response = await fetch(`http://${HOST}:${PORT}/import/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });

      if (response.ok) {
        setMessage("Données envoyées avec succès !");
        toast.success("Les dossiers sont affectés avec succès", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
        });
      } else {
        let errorMsg = "Une erreur est survenue lors de l'envoi des données";
        try {
          const errorData = await response.json();
          if (errorData?.message === "Tu dois remplir la Column ID Gestionnaire") {
            errorMsg = "Tu dois remplir la colonne ID Gestionnaire";
          } else if (errorData?.message) {
            errorMsg = errorData.message;
          }
        } catch (e) {
          // JSON parsing failed, fallback to default error
        }

        toast.error(errorMsg, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
        });
        setMessage("Erreur lors de l'envoi des données : " + errorMsg);
      }
    } catch (err) {
      let errorMsg = "Une erreur est survenue lors de l'envoi des données";
      if (err?.response?.data?.message === "Tu dois remplir la Column ID Gestionnaire") {
        errorMsg = "Tu dois remplir la colonne ID Gestionnaire";
      } else if (err?.message) {
        errorMsg = err.message;
      }

      toast.error(errorMsg, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
      });
      setMessage("Erreur lors de l'envoi des données : " + errorMsg);
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
        marginTop: "-40px",
        marginLeft: "-10px",
        marginRight: "-10px",
        position: "relative",
      }}
    >
      {/* Loading Overlay */}
      {(fileLoading || loading) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              minWidth: "300px",
            }}
          >
            {/* Spinner */}
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #6d0202ff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem auto",
              }}
            />
            <h3 style={{ color: "#290000ff", marginBottom: "0.5rem" }}>
              {fileLoading ? "Chargement du fichier..." : "Envoi en cours..."}
            </h3>
            <p style={{ color: "#666", margin: 0 }}>
              {fileLoading 
                ? "Veuillez patienter pendant le traitement du fichier Excel/CSV"
                : "Veuillez patienter pendant l'envoi des données"
              }
            </p>
          </div>
        </div>
      )}

      {/* CSS Animation for Spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          marginTop: "2rem",
          marginBottom: "-1rem",
          marginLeft: "auto",
          marginRight: "auto",
          width: "500px",
          overflow: "hidden",
          transition: "all 0.2s ease",
        }}
      >
        <button
          onClick={() => setImportMode("marché")}
          disabled={fileLoading || loading}
          style={{
            width: "100px",
            padding: "0.8rem 1rem",
            border: "none",
            backgroundColor: importMode === "marché" ? "#5d0303ff" : "#E5E0D8",
            color: importMode === "marché" ? "#fff" : "#111",
            fontWeight: "bold",
            cursor: fileLoading || loading ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            borderTopLeftRadius: "8px",
            transition: "all 0.2s ease",
            opacity: fileLoading || loading ? 0.6 : 1,
          }}
        >
          MARCHÉ
        </button>
        <button
          onClick={() => navigate("/admin/portefeuille/cadrage")}
          disabled={fileLoading || loading}
          style={{
            width: "100px",
            padding: "0.8rem 1rem",
            border: "none",
            backgroundColor: importMode === "cadrage" ? "#6d0202ff" : "#E5E0D8",
            color: importMode === "cadrage" ? "#fff" : "#111",
            fontWeight: "bold",
            cursor: fileLoading || loading ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            borderTopRightRadius: "8px",
            transition: "all 0.2s ease",
            opacity: fileLoading || loading ? 0.6 : 1,
          }}
        >
          CADRAGE
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "0.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #4d0101ff",
            padding: "2rem",
            borderRadius: "8px",
            width: "500px",
            boxShadow: "0 7px 102px rgba(139, 122, 122, 0.75)",
            opacity: fileLoading || loading ? 0.8 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <h2
            style={{
              color: "#290000ff",
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Importer un fichier Excel -{" "}
            {importMode === "marché" ? "Marché" : "Cadrage"}
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            <label>Fichier (.xls, .xlsx, .csv)</label>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              disabled={fileLoading || loading}
              style={{
                width: "100%",
                padding: "0.4rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                cursor: fileLoading || loading ? "not-allowed" : "pointer",
                opacity: fileLoading || loading ? 0.6 : 1,
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              id="autoSelect"
              checked={repartitionAutomatique}
              onChange={(e) => setRepartitionAutomatique(e.target.checked)}
              disabled={fileLoading || loading}
              style={{ 
                marginRight: "0.5rem",
                cursor: fileLoading || loading ? "not-allowed" : "pointer",
              }}
            />
            <label htmlFor="autoSelect">Répartition automatique</label>
          </div>

          {importMode === "marché" && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label>Marché :</label>
                <select
                  value={selectedMarche}
                  onChange={(e) => setSelectedMarche(parseInt(e.target.value))}
                  disabled={fileLoading || loading}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    cursor: fileLoading || loading ? "not-allowed" : "pointer",
                    opacity: fileLoading || loading ? 0.6 : 1,
                  }}
                >
                  <option disabled>-- Sélectionner un marché --</option>
                  {marches.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.marche}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label>Manager :</label>
                <select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(parseInt(e.target.value))}
                  disabled={fileLoading || loading}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    cursor: fileLoading || loading ? "not-allowed" : "pointer",
                    opacity: fileLoading || loading ? 0.6 : 1,
                  }}
                >
                  <option disabled>-- Sélectionner un manager --</option>
                  {managers.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.username}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label>Lot :</label>
                <select
                  value={selectedLot}
                  onChange={(e) => setSelectedLot(parseInt(e.target.value))}
                  disabled={fileLoading || loading}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    cursor: fileLoading || loading ? "not-allowed" : "pointer",
                    opacity: fileLoading || loading ? 0.6 : 1,
                  }}
                >
                  <option disabled>-- Sélectionner un lot --</option>
                  {lots.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.Nlot}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {importMode === "cadrage" && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label>Type de cadrage :</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  disabled={fileLoading || loading}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    cursor: fileLoading || loading ? "not-allowed" : "pointer",
                    opacity: fileLoading || loading ? 0.6 : 1,
                  }}
                >
                  <option disabled>-- Choisir un type de cadrage --</option>
                  <option>Téléphonique</option>
                  <option>CNSS</option>
                  <option>Patrimoine</option>
                </select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Statut :</label>
                <select
                  value={selectedStatut}
                  onChange={(e) => setSelectedStatut(e.target.value)}
                  disabled={fileLoading || loading}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    cursor: fileLoading || loading ? "not-allowed" : "pointer",
                    opacity: fileLoading || loading ? 0.6 : 1,
                  }}
                >
                  <option disabled>-- Marché --</option>
                  <option>CIH</option>
                  <option>Marché 2</option>
                </select>
              </div>
            </>
          )}

          <button
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: fileLoading || loading ? "#999" : "#6d0202ff",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              cursor: fileLoading || loading ? "not-allowed" : "pointer",
              fontWeight: "500",
              fontSize: "1rem",
              transition: "all 0.2s ease-in-out",
              opacity: fileLoading || loading ? 0.6 : 1,
            }}
            onClick={handleAffecterTaches}
            disabled={fileLoading || loading}
            onMouseEnter={(e) => {
              if (!fileLoading && !loading) {
                e.target.style.backgroundColor = "#670101ff";
                e.target.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!fileLoading && !loading) {
                e.target.style.backgroundColor = "#6d0202ff";
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            {fileLoading || loading 
              ? (fileLoading ? "CHARGEMENT..." : "ENVOI EN COURS...")
              : (importMode === "cadrage" ? "MISE EN PLACE" : "AFFECTER")
            }
          </button>
        </div>
      </div>
    </div>
  );
}