import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaFolder, FaDatabase  } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";

function Card({
  label,
  count,
  amount,
  bgColor,
  color,
  active,
  icon: Icon,
  onClick,
  statistic
}) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 8,
        padding: "8px 12px",
        backgroundColor: bgColor,
        color: color,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: active ? "0 0 0 2px #1e40af" : "none",
        opacity: active ? 1 : 0.85,
        transition: "box-shadow 0.2s, opacity 0.2s",
        minHeight: "70px",
        gap: "12px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "24px", display: "flex", alignItems: "center" }}>
        <Icon />
      </div>
      <div style={{ textAlign: "left" }}>
        <div
          style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "2px" }}
        >
          {label}
        </div>
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>{statistic.count}</div>
        <div style={{ fontSize: "11px", opacity: 0.9 }}>{statistic.creance} MAD</div>
      </div>
    </div>
  );
}

export default function CardeManager({ onCardClick, onNewClick, dossiers }) {
  const [activeCard, setActiveCard] = useState(null);

  const [statistic, setStatistic] = useState([]);

  const states = [
    "Nouvelles ations",
    "Action à traiter",
    "Actions en backlog",
    "Actions en cours",
    "Actions suite au cadrage",
  ];

  useEffect(() => {
    const countStats = () => {
      const stats = states.map((state) => {
        const filtered = dossiers.filter((elem) => elem.dossier.etatResponsable === state);

        const count = filtered.length;

        const creanceSum = filtered.reduce((sum, elem) => {
          return sum + (elem.creance.creance || 0);
        }, 0);

        return { count, creance: creanceSum.toFixed(2) }; // rounded to 2 decimals
      });

      setStatistic(stats);
      console.log(stats);
    };

    countStats();
  }, [dossiers]);

  const cards = [
    {
      key: "Nouvelles ations",
      label: "Nouveau",
      count: "",
      amount: "",
      bgColor: "#9f8081ff",
      color: "#fff",
      icon: FaPlusCircle,
      statistic: statistic[0],
    },
    {
      key: "Action à traiter",
      label: "Dossiers à traiter",
      count: "188",
      amount: "7 905 953.94 MAD",
      bgColor: "#470505e1",
      color: "#fff",
      icon: FaFolder,
      statistic: statistic[1],
    },

    {
      key: "Actions en cours",
      label: "En cours",
      count: "2459",
      amount: "110 770 312.76 MAD",
      bgColor: "#908d8ddf",
      color: "#fff",
      icon: MdEditDocument,
      statistic: statistic[3],
    },
        {
      key: "Actions en backlog",
      label: "En backlog",
      count: "6374",
      amount: "253 201 962.21 MAD",
      bgColor: "#c29393ff",
      color: "#fff",
      icon: FaDatabase,
      statistic: statistic[2],
    },
    {
      key: "Actions suite au cadrage",
      label: "Suite au cadrage",
      count: "1021",
      amount: "22 855 640.76 MAD",
      bgColor: "#9f8081ff",
      color: "#fff",
      icon: FaFileLines,
      statistic: statistic[4],
    },
  ];

  const handleClick = (key) => {
    setActiveCard(key);
    if (key === "new") {
      if (onNewClick) onNewClick();
    } else {
      if (onCardClick) onCardClick(key);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "0.5rem",
        padding: "0.5rem",
      }}
    >
      {statistic.length === states.length &&
      cards.map((card) => (
        <Card
          key={card.key}
          label={card.label}
          count={card.count}
          amount={card.amount}
          bgColor={card.bgColor}
          color={card.color}
          icon={card.icon}
          active={activeCard === card.key}
          onClick={() => handleClick(card.key)}
          statistic={card.statistic}
        />
      ))}
    </div>
  );
}
