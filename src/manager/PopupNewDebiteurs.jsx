import React, { useState } from "react";

export default function PopupNewDebiteurs({ onClose, onValidate }) {
  const [nouveauxDebiteurs, setNouveauxDebiteurs] = useState([
    {
      client: "Bank Assafa",
      debiteur: "Omar El Youssfi",
      piece: "ZY123456",
      dossier: "10",
      solde: "7,000.00",
      gestionnaire: "E",
      action: "Nouvelle action",
      type: "aTraiter"
    },
    {
      client: "CIH",
      debiteur: "Imane Cherkaoui",
      piece: "ZX654321",
      dossier: "11",
      solde: "5,500.00",
      gestionnaire: "F",
      action: "Nouvelle action",
      type: "aTraiter"
    }
  ]);

  const handleValidate = () => {
    onValidate(nouveauxDebiteurs);
    setNouveauxDebiteurs([]); // vider le tableau après validation
  };

  const thStyle = {
    padding: "0.5rem",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
    color: "#1e293b",
    fontWeight: 600,
    fontSize: "0.75rem"
  };

  const tdStyle = {
    padding: "0.5rem",
    textAlign: "center",
    fontSize: "0.75rem"
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          maxWidth: "80%",
          maxHeight: "80%",
          overflowY: "auto"
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "20px" }}>Débiteurs à ajouter</h2>

        {nouveauxDebiteurs.length > 0 ? (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "1rem"
              }}
            >
              <thead style={{ backgroundColor: "#f8fafc" }}>
                <tr>
                  {["Client", "Intitulé débiteur", "Pièce", "Dossier", "Solde", "Gestionnaire", "Action"].map(
                    (header, idx) => (
                      <th key={idx} style={thStyle}>{header}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {nouveauxDebiteurs.map((row, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{row.client}</td>
                    <td style={tdStyle}>{row.debiteur}</td>
                    <td style={tdStyle}>{row.piece}</td>
                    <td style={tdStyle}>{row.dossier}</td>
                    <td style={tdStyle}>{row.solde}</td>
                    <td style={tdStyle}>{row.gestionnaire}</td>
                    <td style={tdStyle}>{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: "right" }}>
              <button
                onClick={handleValidate}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Valider
              </button>
            </div>
          </>
        ) : (
          <p style={{ fontStyle: "italic", color: "#64748b" }}>
            Il n'y a plus de débiteurs à ajouter.
          </p>
        )}
      </div>
    </div>
  );
}