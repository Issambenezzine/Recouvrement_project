import React, { useState, useMemo, useEffect } from "react";
import { FaSync, FaFileExcel, FaDownload } from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

import moment from "moment";
// état initial des filtres
const initialFilters = {
  dossierInterne: null,
  dossierExterne: "",
  client: "",
  debiteur: "",
  minMontant: "",
  maxMontant: "",
  dateFrom: "",
  dateTo: "",
  typeReglement: "",
  modeReglement: "",
  responsable: "",
};

export default function G_encaissement({ data }) {
  const [dossier, setDossiers] = useState(data);
  const [filters, setFilters] = useState(initialFilters);
  const [downloadingId, setDownloadingId] = useState(null);
  const [modeReglementValues, setModeReglementValues] = useState([]);
  const [typeReglementValues, setTypeReglementValues] = useState([]);
  const [clients, setClient] = useState([]);
  const navigate = useNavigate()
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;  
  const verifyUser = async () => {
    let url;
    switch(localStorage.getItem("Role")){
      case "ADMIN":
        url = `http://${HOST}:${PORT}/auth/admin`
        break;
      case "VISITEUR": 
        url = `http://${HOST}:${PORT}/auth/visiteur`
        break;
    }
    try {
      console.log("verifyUser called of role :", localStorage.getItem("Role"));
      const res = await axios.get(url, {
        withCredentials: true,
      });
    } catch (err) {
      navigate("/");
    }
  };

  // mise à jour d'un filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const fetchClient = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/clients`);
      setClient(res.data.filter((stat) => stat.visibility === 1));
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchTypeReglement = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/typereg`);
      setTypeReglementValues(res.data.filter((r) => r.visibility === 1));
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchModeReglement = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/modereg`);
      setModeReglementValues(res.data.filter((r) => r.visibility === 1));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    verifyUser();
    fetchClient();
    fetchTypeReglement();
    fetchModeReglement();
    const storedData = sessionStorage.getItem("dossiersAdmin");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setDossiers(data);
        console.log("Parsed dossiers:", data);
      } catch (error) {
        console.error("Error parsing dossiersAdmin data:", error);
      }
    }
  }, []);

  // Fonction pour filtrer les données
  const getFilteredData = useMemo(() => {
    return dossier.filter((row) => {
      // Vérifier les filtres de base
      const matchesDossierInterne =
        !filters.dossierInterne ||
        row.dossier?.id === Number(filters.dossierInterne);

      const matchesDossierExterne =
        !filters.dossierExterne ||
        (row.dossier?.NDossier?.toString() || "").includes(
          filters.dossierExterne
        );

      const matchesClient =
        !filters.client ||
        (row.client?.marche || "")
          .toLowerCase()
          .includes(filters.client.toLowerCase());

      const matchesDebiteur =
        !filters.debiteur ||
        (row.debiteurInfo?.debiteur?.nom || "")
          .toLowerCase()
          .includes(filters.debiteur.toLowerCase());

      const matchesResponsable =
        !filters.responsable ||
        row.encaissement.some((enc) =>
          (enc.responsable || "")
            .toLowerCase()
            .includes(filters.responsable.toLowerCase())
        );

      const matchesTypeReglement =
        !filters.typeReglement ||
        row.encaissement.some((enc) => enc.typeReg === filters.typeReglement);

      const matchesModeReglement =
        !filters.modeReglement ||
        row.encaissement.some((enc) => enc.modeReg === filters.modeReglement);

      // Filtres de date
      let matchesDateFrom = true;
      let matchesDateTo = true;

      if (filters.dateFrom || filters.dateTo) {
        matchesDateFrom =
          !filters.dateFrom ||
          row.encaissement.some((enc) => enc.dateReg >= filters.dateFrom);

        matchesDateTo =
          !filters.dateTo ||
          row.encaissement.some((enc) => enc.dateReg <= filters.dateTo);
      }

      // Filtres de montant
      let matchesMinMontant = true;
      let matchesMaxMontant = true;

      if (filters.minMontant || filters.maxMontant) {
        matchesMinMontant =
          !filters.minMontant ||
          row.encaissement.some(
            (enc) => enc.montant >= parseFloat(filters.minMontant)
          );

        matchesMaxMontant =
          !filters.maxMontant ||
          row.encaissement.some(
            (enc) => enc.montant <= parseFloat(filters.maxMontant)
          );
      }

      return (
        matchesDossierInterne &&
        matchesDossierExterne &&
        matchesClient &&
        matchesDebiteur &&
        matchesResponsable &&
        matchesTypeReglement &&
        matchesModeReglement &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesMinMontant &&
        matchesMaxMontant
      );
    });
  }, [dossier, filters]);

  // Calculer le total des montants
  const totalMontant = useMemo(() => {
    return getFilteredData.reduce((total, row) => {
      return (
        total +
        row.encaissement.reduce(
          (encTotal, enc) => encTotal + (enc.montant || 0),
          0
        )
      );
    }, 0);
  }, [getFilteredData]);

  const handleDownload = async (piece) => {
    try {
      const response = await axios.get(
        `http://${HOST}:${PORT}/encaissement/download/${piece.id}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      // Create blob link to download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Use the original filename from the piece
      const filename = piece.fileName || `encaissement_${piece.id}`;
      link.setAttribute("download", filename);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Erreur lors du téléchargement du fichier");
    } finally {
      setDownloadingId(null);
    }
  };

  // Calculer le nombre total d'encaissements
  const totalCount = useMemo(() => {
    return getFilteredData.reduce(
      (count, row) => count + row.encaissement.length,
      0
    );
  }, [getFilteredData]);

  // remise à zéro de données et filtres
  const handleRefresh = () => {
    setFilters(initialFilters);
  };

  // export des données filtrées en Excel
  const exportToExcel = () => {
    const exportData = [];
    getFilteredData.forEach((row) => {
      row.encaissement.forEach((enc) => {
        exportData.push({
          "Id reçu": enc.id,
          "Dossier interne": row.dossier?.id || "",
          "Dossier externe": row.dossier?.NDossier || "",
          Marché: row.client?.marche || "",
          Commission: row.client?.commissione || "",
          Débiteur: row.debiteurInfo?.debiteur?.nom || "",
          Montant: enc.montant,
          Date: moment(enc.dateReg).format("DD/MM/YYYY"),
          "Type règlement": enc.typeReg,
          "Mode règlement": enc.modeReg,
          Gestionnaire: row.gestionnaire || "",
          Responsable: enc.responsable || "",
        });
      });
    });

    // 1️⃣ Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 2️⃣ Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Encaissements");

    // 3️⃣ Export the workbook to a file
    XLSX.writeFile(workbook, "encaissements.xlsx");
    // Simuler l'export Excel (vous pouvez utiliser XLSX si disponible)
  };

  // Obtenir les valeurs uniques pour les dropdowns
  const uniqueClients = [
    ...new Set(dossier.map((d) => d.client?.marche).filter(Boolean)),
  ];
  const uniqueResponsables = [
    ...new Set(
      dossier
        .flatMap((d) => d.encaissement.map((e) => e.responsable))
        .filter(Boolean)
    ),
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(255, 255, 255, 1)",
        padding: "1rem",
        boxSizing: "border-box",
        overflow: "hidden",
        margin: "0 auto",
        marginTop: "-1rem",
      }}
    >
      {/* Entête */}
      <div style={{ marginBottom: "0.5rem" }}>
        <h2 style={{ margin: 0 }}>Liste des encaissements</h2>
        <div style={{ display: "flex", gap: "2rem", fontWeight: "bold" }}>
          <div>{totalMontant} MAD</div>
          <div>
            {totalCount} encaissement{totalCount > 1 ? "s" : ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button
            onClick={handleRefresh}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.5rem 1rem",
              border: "none",
              backgroundColor: "#6c757d",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <FaSync /> Actualiser
          </button>
          <button
            onClick={exportToExcel}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.5rem 1rem",
              border: "none",
              backgroundColor: "#036d5bff",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <FaFileExcel /> Excel
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div
        style={{ display: "flex", flex: 1, gap: "1rem", overflow: "hidden" }}
      >
        {/* Sidebar filtres */}
        <div
          style={{
            width: "250px",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "4px",
            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            overflowY: "auto",
          }}
        >
          {/* Dossier interne */}
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              placeholder="N° dossier interne"
              type="text"
              name="dossierInterne"
              value={filters.dossierInterne}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </label>

          {/* Dossier externe */}
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              placeholder="Id dossier externe"
              type="text"
              name="dossierExterne"
              value={filters.dossierExterne}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </label>

          {/* Client */}
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <select
              name="client"
              value={filters.client}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="">Tous les clients</option>
              {clients.map((client, index) => (
                <option key={index} value={client.marche}>
                  {client.marche}
                </option>
              ))}
            </select>
          </label>

          {/* Débiteur */}
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              placeholder="Nom débiteur"
              type="text"
              name="debiteur"
              value={filters.debiteur}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </label>

          {/* Montant min/max */}
          <div
            style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
          >
            <div style={{ flex: 1 }}>
              <input
                placeholder="Montant min"
                type="number"
                name="minMontant"
                value={filters.minMontant}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                placeholder="Montant max"
                type="number"
                name="maxMontant"
                value={filters.maxMontant}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          {/* Date From / To */}
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              placeholder="Date de début"
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              placeholder="Date de fin"
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </label>

          {/* Type de règlement */}
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <select
              name="typeReglement"
              value={filters.typeReglement}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="">Type de règlement</option>
              {typeReglementValues.map((type, index) => (
                <option key={index} value={type.typeReg}>
                  {type.typeReg}
                </option>
              ))}
            </select>
          </label>

          {/* Mode de règlement */}
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <select
              name="modeReglement"
              value={filters.modeReglement}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="">Mode de règlement</option>
              {modeReglementValues.map((mode, index) => (
                <option key={index} value={mode.modeReg}>
                  {mode.modeReg}
                </option>
              ))}
            </select>
          </label>

          {/* Responsable */}
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <select
              name="responsable"
              value={filters.responsable}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="">Tous les responsables</option>
              {uniqueResponsables.map((resp) => (
                <option key={resp} value={resp}>
                  {resp}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Zone tableau */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "4px",
            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Tableau scrollable */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.5rem",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#6c757d", color: "white" }}>
                <tr>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    ID reçu
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    N° Dossier Externe
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    N° Dossier Interne
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Marché
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Commission
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Débiteur
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Montant
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Mode
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Gestionnaire
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Responsable d'encaissement
                  </th>
                  <th
                    style={{
                      padding: "0.3rem",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Aperçu
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      Aucun encaissement trouvé avec les filtres appliqués
                    </td>
                  </tr>
                ) : (
                  getFilteredData.map((row, i) =>
                    row.encaissement.map((enc, j) => (
                      <tr
                        key={`${i}-${j}`}
                        style={{
                          backgroundColor:
                            (i + j) % 2 === 0 ? "#f8f9fa" : "white",
                        }}
                      >
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {enc.id || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {row.dossier?.NDossier || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {row.dossier?.id || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {row.client?.marche || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {row.client?.commissione || 0}%
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {row.debiteurInfo?.debiteur?.nom || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                            fontWeight: "bold",
                          }}
                        >
                          {(enc.montant || 0).toLocaleString()} MAD
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {moment(enc.dateReg).format("DD/MM/YYYY") || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {enc.typeReg || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {enc.modeReg || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {row.gestionnaire || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {enc.responsable || "--"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #eee",
                          }}
                        >
                          {downloadingId === enc.id ? (
                            <div
                              style={{
                                display: "inline-block",
                                width: "16px",
                                height: "16px",
                                border: "2px solid #f3f3f3",
                                borderTop: "2px solid #004d40",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                              }}
                            />
                          ) : (
                            <FaDownload
                              style={{
                                cursor: "pointer",
                                color: "#004d40",
                                fontSize: "16px",
                                transition: "color 0.3s, transform 0.2s",
                              }}
                              title={`Télécharger ${enc.fileName}`}
                              onClick={() => handleDownload(enc)}
                              onMouseEnter={(e) => {
                                e.target.style.color = "#00695c";
                                e.target.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.color = "#004d40";
                                e.target.style.transform = "scale(1)";
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
