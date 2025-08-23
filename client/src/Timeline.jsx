// Timeline.jsx
import React, {useEffect, useState} from "react";
import axios from "axios"
import moment from "moment";

const Timeline = ({ dossier, title = "Timeline", actions = [] }) => {
    const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  if (!actions || actions.length === 0) {
    return <p style={{ color: "gray" }}>Aucun élément encore ajouté.</p>;
  }

  const [timeline, setTimeline] = useState([]);
useEffect(() => {
  const fetchTimeline = async () => {
    try {
      const res = await axios.post(
        `http://${HOST}:${PORT}/timeline/get`,
        { dossierId: dossier.dossier.id },
        { withCredentials: true }
      );

      const transformedTimeline = res.data.map((time) => ({
        ...time,
        createdAt: moment(time.createdAt).format("DD/MM/YYYY"),
      }));

      setTimeline(transformedTimeline);
    } catch (err) {
      console.log(err.message);
    }
  };
  fetchTimeline();
}, []);

  return (
<div style={{ marginTop: "1rem", width: "180px", position: "relative" }}>
  <h4
    style={{
      borderLeft: "4px solid #006A71",
      paddingLeft: "8px",
      fontSize: "1.1rem",
    }}
  >
    {title}
  </h4>

  {/* Vertical timeline line */}
  <div
    style={{
      position: "absolute",
      top: "1.6rem", // aligns with top circle center
      bottom: "1.6rem",
      left: "0.9rem",
      width: "2px",
      backgroundColor: "#ccc",
      zIndex: 0,
      marginTop:"40px"
    }}
  />

  {/* Timeline items (reversed) */}
  {[...timeline].reverse().map((item, index) => (
    <div
      key={index}
      style={{
        position: "relative",
        paddingLeft: "2.5rem",
        marginBottom: "2rem",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "0.3rem",
          top: "0rem",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor:
            item.status_timeline === "Promesse" ? "#f44336" : "#0099cc",
        }}
      />
      <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
        {item.status_timeline}
      </div>
      <small style={{ color: "#555" }}>{item.createdAt}</small>
    </div>
  ))}

  {/* Oldest INITIE status */}
  <div
    style={{
      position: "relative",
      paddingLeft: "2.5rem",
      marginBottom: "2rem",
      zIndex: 1,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: "0.3rem",
        top: "0rem",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        backgroundColor: "#f44336", // red for INITIE at bottom
      }}
    />
    <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>INITIE</div>
    <small style={{ color: "#555" }}>{moment(dossier.dossier.createdAt ).format("DD/MM/YYYY")}</small>
  </div>
</div>


  );
};

export default Timeline;
