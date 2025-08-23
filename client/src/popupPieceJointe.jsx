import React, { useState } from "react";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";

const PopupPieceJointe = ({ onClose, dossier ,onSave}) => {
  const [form, setForm] = useState({
    commentaire: "",
    dateAjout: "",
    file: null,
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [dateAjout, setDateAjout] = useState(getTodayDate());

    const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        file,
        filePreviewUrl: previewUrl,
      }));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment || !dateAjout || !form.file) {
      setError("Tous les champs sont obligatoires, y compris l'image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", form.file);
    formData.append("commentaire", comment);
    formData.append("dateAjout", dateAjout);
    formData.append("responsable",dossier.gestionnaire)
    formData.append("dossierId", Number(dossier.dossier.id));

    try {
      const res = await fetch(`http://${HOST}:${PORT}/upload/piece`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi du fichier");
      if (res.ok) {
        toast.success(`Une pièce jointe a été ajouté !`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
      }

      const data = await res.json();

      const savedForm = {
        ...form,
        uploadedFilename: data.filename,
      };
      onSave()
    } catch (err) {
      setError("Erreur lors de l'envoi du fichier : " + err.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <form
        id="popupPieceJointeForm"
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: "700px",
          borderRadius: "8px",
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "row",
          padding: "1.5rem",
          color: "#222",
          boxSizing: "border-box",
          gap: "2rem",
          position: "relative",
        }}
      >
        {/* Colonne gauche - inputs */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <h2 style={{ fontWeight: "bold", fontSize: "1.8rem", margin: 0 }}>
            AJOUTER UNE PIÈCE JOINTE
          </h2>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            Commentatire
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              type="text"
              required
              style={{
                marginTop: "6px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
              rows={4}
              
            ></textarea>
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            Date d'ajout
            <input
              type="date"
              value={dateAjout}
              onChange={(e) => setDateAjout(e.target.value)}
              readOnly
              required
              style={{
                marginTop: "6px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                color: "#c0392b",
                fontSize: "0.9rem",
                marginTop: "-1rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Boutons */}
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 25px",
                backgroundColor: "#ddd",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                color: "#333",
                flex: 1,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 25px",
                backgroundColor: "#00796b",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                flex: 1,
              }}
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Colonne droite - upload */}
        <div
          style={{
            flex: 1,
            border: "2px dashed #ccc",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#666",
            fontWeight: "600",
            cursor: "pointer",
            userSelect: "none",
            position: "relative",
            padding: "1rem",
            minHeight: "250px",
          }}
          onClick={() =>
            document.getElementById("fileInputPieceJointe").click()
          }
        >
          {form.filePreviewUrl ? (
            <img
              src={form.filePreviewUrl}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "250px",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
          ) : (
            <>
              <div style={{ fontSize: "1rem", marginBottom: "8px" }}>
                Cliquer pour charger une image
              </div>
              <div style={{ fontSize: "2.5rem", color: "#999" }}>+</div>
            </>
          )}

          <input
            type="file"
            // accept="image/*"
            id="fileInputPieceJointe"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </form>
    </div>
  );
};

export default PopupPieceJointe;
