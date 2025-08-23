import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Slide } from "react-toastify";

const Commentaire = ({ id }) => {
  const [comments, setComments] = useState([]);
  const [addedComment, setAddedComment] = useState("")
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://${HOST}:${PORT}/commentaire/get/${id}`,
        {
          withCredentials: true,
        }
      );
      setComments(res.data);
    } catch (err) {}
  };

  const handleAddComment = async () => {
    try {
      let url;
      let role = localStorage.getItem("Role");
      switch (role) {
        case "GESTIONNAIRE":
          url = `http://${HOST}:${PORT}/commentaire/gestionnaire`;
          break;
        case "RESPONSABLE":
          url = `http://${HOST}:${PORT}/commentaire/responsable`;
          break;
        case "ADMIN":
          url = `http://${HOST}:${PORT}/commentaire/responsable`;
          break;
      }
      const res = await axios.put(url,{id:id, commentaire: addedComment} ,{ withCredentials: true });
      toast.success(`${res.data.message}`, {
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
      fetchComments();
    } catch (err) {
      console.log(err.message);
      toast.error(`${err.response?.data?.message}`, {
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
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "100%" }}>
      <h1 style={{color:"#4b0101ff"}}>Commentaires</h1>

      {/* Existing comments section */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ flex: 1 }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Commentaire Gestionnaire
          </label>
          <textarea
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Aucun Commentaire"
            readOnly
            value={comments.commentaire}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Commentaire Responsable
          </label>
          <textarea
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Aucun Commentaire"
            readOnly
            value={comments.commentaire_responsable}
          />
        </div>
      </div>

      {/* Add new comment section */}
      {localStorage.getItem("Role") !== "VISITEUR" && (
        <div
          style={{
            marginTop: "30px",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
          }}
        >
          <h3>Ajouter un commentaire</h3>
          <div style={{ marginBottom: "10px" }}>
            <textarea
              value={addedComment}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontFamily: "Arial, sans-serif",
              }}
              placeholder="Tapez votre commentaire ici..."
              onChange={(e) => setAddedComment(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddComment}
            disabled={
                addedComment === ""
              }
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Ajouter Commentaire
          </button>
        </div>
      )}
    </div>
  );
};

export default Commentaire;
