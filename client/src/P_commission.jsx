// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";

// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import "./P_Commission.css";

// const P_Commission = () => {
//   // États pour les filtres
//   const [selectedManager, setSelectedManager] = useState("Tous");
//   const [selectedMonth, setSelectedMonth] = useState("Tous");
//   const [monthlyEncaissement, setmonthlyEncaissement] = useState([]);
//   const [monthlyCommiss, setmonthlyCommiss] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [montantReel, setMontantReel] = useState([]);
//   const [tableEncaiss, setTableEncaiss] = useState([]);
//   const [dailyEncaissement, setDailyEncaissement] = useState([]); // Add state for daily data
//   const [dailyCommission, setDailyCommission] = useState([]); // Add state for daily commission
//   const HOST = import.meta.env.VITE_SERVER_HOST;
//   const PORT = import.meta.env.VITE_SERVER_PORT;
//   const [cards, setCards] = useState({
//     nombreTotalInterventions: null,
//     TotalCreanceEncours: null,
//     montantEncaisse: null,
//     taux: null,
//     retardCumule: null,
//   });
//   const socketRef = useRef(null);
//   const navigate = useNavigate();
//   const [statistics, setStatistics] = useState([]);

//   // Helper function to filter data by month and year
//   const filterDataByDate = (data, year, month) => {
//     return data.filter((item) => {
//       const itemDate = new Date(item.createdAt);
//       const itemYear = itemDate.getFullYear();
//       const itemMonth = itemDate.getMonth() + 1; // JavaScript months are 0-indexed
      
//       // Filter by year
//       if (year && itemYear !== parseInt(year)) {
//         return false;
//       }
      
//       // Filter by month if not "Tous"
//       if (month !== "Tous") {
//         const monthNumber = monthToNumber[month];
//         if (monthNumber && itemMonth !== parseInt(monthNumber)) {
//           return false;
//         }
//       }
      
//       return true;
//     });
//   };

//   // Helper function to get objectives for a specific period
//   const getObjectivesForPeriod = (objectifs, year, month) => {
//     return objectifs.filter((obj) => {
//       const objDate = new Date(obj.createdAt);
//       const objYear = objDate.getFullYear();
//       const objMonth = objDate.getMonth() + 1;
      
//       if (year && objYear !== parseInt(year)) {
//         return false;
//       }
      
//       if (month !== "Tous") {
//         const monthNumber = monthToNumber[month];
//         if (monthNumber && objMonth !== parseInt(monthNumber)) {
//           return false;
//         }
//       }
      
//       return true;
//     });
//   };

//   // Helper function to process daily data from graphCommissione
//   const processDailyData = (graphCommissione, year, month) => {
//     const filteredData = filterDataByDate(graphCommissione, year, month);
    
//     // Group by date
//     const dailyMap = {};
    
//     filteredData.forEach((item) => {
//       const date = new Date(item.createdAt).toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit'
//       });
      
//       if (!dailyMap[date]) {
//         dailyMap[date] = {
//           date: date,
//           montant: 0,
//           commission: 0
//         };
//       }
      
//       const montant = item.montant || 0;
//       const commissionRate = item.commissione || 0;
//       const commission = montant * (commissionRate / 100);
      
//       dailyMap[date].montant += montant;
//       dailyMap[date].commission += commission;
//     });
    
//     // Convert to arrays and sort by date
//     const dailyEncaissement = Object.values(dailyMap)
//       .map(item => ({ date: item.date, value: item.montant }))
//       .sort((a, b) => new Date('2024/' + a.date) - new Date('2024/' + b.date));
      
//     const dailyCommission = Object.values(dailyMap)
//       .map(item => ({ date: item.date, value: item.commission }))
//       .sort((a, b) => new Date('2024/' + a.date) - new Date('2024/' + b.date));
    
//     return { dailyEncaissement, dailyCommission };
//   };

//   useEffect(() => {
//     socketRef.current = io(`http://${HOST}:${PORT}`);
//     const socket = socketRef.current;
//     const handleConnect = () => {
//       console.log("✅ Connected to socket server statistics:", socket.id);
//       socket.emit("plotage_commission");
//     };

//     const handleData = (statis) => {
//       console.log("📦 Received statistics:", statis);
//       console.log("Selected filters - Year:", selectedYear, "Month:", selectedMonth);
//       setStatistics(statis);
      
//       // Filter data based on selected year and month
//       const filteredGraphCommissions = filterDataByDate(
//         statis?.graphCommissione || [], 
//         selectedYear, 
//         selectedMonth
//       );
      
//       const filteredObjectifs = getObjectivesForPeriod(
//         statis?.objectifs || [], 
//         selectedYear, 
//         selectedMonth
//       );

//       // Filter encaissGestionnaire directly by date
//       const filteredEncaissGestionnaire = filterDataByDate(
//         statis?.encaissGestionnaire || [], 
//         selectedYear, 
//         selectedMonth
//       );

//       console.log("Filtered encaissGestionnaire:", filteredEncaissGestionnaire.length, "items");
//       console.log("Filtered objectifs:", filteredObjectifs.length, "items");

//       // Process daily data from graphCommissione
//       const { dailyEncaissement: processedDailyEncaissement, dailyCommission: processedDailyCommission } = 
//         processDailyData(statis?.graphCommissione || [], selectedYear, selectedMonth);
      
//       setDailyEncaissement(processedDailyEncaissement);
//       setDailyCommission(processedDailyCommission);

//       // Process encaissement data for performance chart with filtering
//       const performanceMap = {};
      
//       filteredEncaissGestionnaire.forEach((item) => {
//         const gestionnaireId = item.id;
//         if (!performanceMap[gestionnaireId]) {
//           performanceMap[gestionnaireId] = {
//             id: item.id,
//             name: item.username,
//             réel: 0,
//             objectif: 0,
//           };
//         }
        
//         performanceMap[gestionnaireId].réel += item.montant_total || 0;
//       });

//       // Add objectives for performance chart
//       const result = Object.values(performanceMap).map((gestionnaire) => {
//         const obj = filteredObjectifs.find((o) => o.gestionnaireId === gestionnaire.id) || {};
//         return {
//           ...gestionnaire,
//           objectif: obj.newObjectif || 0,
//         };
//       });

//       const gestionnaireMap = {};
      
//       filteredEncaissGestionnaire.forEach((item) => {
//         const gestionnaireId = item.id;
//         if (!gestionnaireMap[gestionnaireId]) {
//           gestionnaireMap[gestionnaireId] = {
//             id: item.id,
//             nom: item.username,
//             encaissement: 0,
//             commission: 0,
//             objectif: 0,
//           };
//         }
        
//         gestionnaireMap[gestionnaireId].encaissement += item.montant_total || 0;
//         gestionnaireMap[gestionnaireId].commission += item.Commission || 0;
//       });

//       // Add objectives for each gestionnaire
//       const table = Object.values(gestionnaireMap).map((gestionnaire) => {
//         // Get objective for this gestionnaire in the filtered period
//         const obj = filteredObjectifs.find((o) => o.gestionnaireId === gestionnaire.id) || {};
//         const objectif = obj.newObjectif || 0;
        
//         return {
//           ...gestionnaire,
//           objectif: objectif,
//           taux: objectif > 0 ? (gestionnaire.commission / objectif) * 100 : 0,
//         };
//       });

//       // Process monthly data
//       const encaisss = Array.from({ length: 12 }, (_, i) => ({
//         month: new Date(0, i).toLocaleString("fr-FR", { month: "short" }),
//         value: 0,
//       }));

//       const commiss = Array.from({ length: 12 }, (_, i) => ({
//         month: new Date(0, i).toLocaleString("fr-FR", { month: "short" }),
//         value: 0,
//       }));

//       // Process filtered encaissGestionnaire for monthly charts
//       filteredEncaissGestionnaire.forEach((item) => {
//         const itemDate = new Date(item.createdAt);
//         const monthIndex = itemDate.getMonth();
//         const montant = item.montant_total || 0;
//         const commission = item.Commission || 0;
        
//         encaisss[monthIndex].value += montant;
//         commiss[monthIndex].value += commission;
//       });

//       setmonthlyEncaissement(encaisss);
//       setmonthlyCommiss(commiss);
//       setMontantReel(result);
//       setTableEncaiss(table.sort((a, b) => b.taux - a.taux));
//       console.log("Filtered result: ", result);
//       console.log("Filtered table: ", table);
//     };

//     const handleError = (errMsg) => {
//       console.error("❌ Error received:", errMsg);
//       // setError(errMsg); // Uncomment if you have error state
//     };

//     // Listen to socket events
//     socket.on("connect", handleConnect);
//     socket.on("plotage_commission", handleData);
//     socket.on("plotage_commissionError", handleError);

//     // Cleanup
//     return () => {
//       socket.off("connect", handleConnect);
//       socket.off("plotage_commission", handleData);
//       socket.off("plotage_commissionError", handleError);
//     };
//   }, [selectedYear, selectedMonth]); // Add selectedMonth to dependencies

//   // Données de synthèse
//   const summary = [
//     {
//       label: "Nombre total d'interventions",
//       value: statistics?.nombreTotalInterventions,
//     },
//     {
//       label: "Total des créances en cours",
//       value: statistics?.TotalCreanceEncours,
//       suffix: " DH",
//     },
//     {
//       label: "Montant encaissé",
//       value: statistics?.montantEncaisse,
//       suffix: " DH",
//     },
//     { label: "Retards cumulés", value: statistics?.TotalCreanceRetard, suffix: " DH" },
//     {
//       label: "Taux de recouvrement global",
//       value:
//         statistics?.taux !== undefined ? Number(statistics.taux).toFixed(1) : 0,
//       suffix: " %",
//     },
//     {
//       label: "Moyenne de traitement par gestionnaire",
//       value: statistics?.moyTrait,
//     },
//   ];

//   // Options des filtres
//   const managers = [2024, 2025];
//   const months = [
//     "Tous",
//     "Janvier",
//     "Février",
//     "Mars",
//     "Avril",
//     "Mai",
//     "Juin",
//     "Juillet",
//     "Août",
//     "Septembre",
//     "Octobre",
//     "Novembre",
//     "Décembre",
//   ];

//   const monthToNumber = {
//     Janvier: "01",
//     Février: "02",
//     Mars: "03",
//     Avril: "04",
//     Mai: "05",
//     Juin: "06",
//     Juillet: "07",
//     Août: "08",
//     Septembre: "09",
//     Octobre: "10",
//     Novembre: "11",
//     Décembre: "12",
//   };

//   const monthlyCommission = monthlyEncaissement.map((d) => ({
//     month: d.month,
//     value: Math.round(d.value * 0.1),
//   }));

//   // Calculate totals for the filtered period
//   const totalMonthlyEncaissement = monthlyEncaissement.reduce((sum, item) => sum + item.value, 0);
//   const totalMonthlyCommission = monthlyCommiss.reduce((sum, item) => sum + item.value, 0);
//   const totalDailyEncaissement = dailyEncaissement.reduce((sum, item) => sum + item.value, 0);
//   const totalDailyCommission = dailyCommission.reduce((sum, item) => sum + item.value, 0);

//   return (
//     <div className="p-commission-page">
//       {/* Cartes de synthèse */}
//       <div className="stats-container">
//         {summary.map((item) => (
//           <div key={item.label} className="stats-card">
//             <h3>{item.label}</h3>
//             <p>
//               {new Intl.NumberFormat("fr-FR").format(item.value)}
//               {item.suffix || ""}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Filtres */}
//       <div className="controls">
//         <div>
//           <label>ANNEE</label>
//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//           >
//             {statistics?.years?.map((m, index) => (
//               <option key={index} value={m.year}>
//                 {m.year}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label>MOIS</label>
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//           >
//             {months.map((m) => (
//               <option key={m} value={m}>
//                 {m}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Tableau et bouton Actualiser */}
//       <div className="table-header">
//         <h2>Tableau de suivi des encaissements</h2>
//       </div>
//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>N°</th>
//               <th>Nom et Prénom</th>
//               <th>Encaissement N</th>
//               <th>Commission N</th>
//               <th>Objectif</th>
//               <th>Taux (%)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableEncaiss.map((row) => (
//               <tr key={row.id}>
//                 <td>{row.id}</td>
//                 <td>{row.nom}</td>
//                 <td>
//                   {new Intl.NumberFormat("fr-FR").format(row.encaissement)} DH
//                 </td>
//                 <td>
//                   {new Intl.NumberFormat("fr-FR").format(row.commission)} DH
//                 </td>
//                 <td>
//                   {new Intl.NumberFormat("fr-FR").format(row.objectif)} DH
//                 </td>
//                 <td>{Number(row.taux).toFixed(1)} %</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Section Charts */}
//       <div className="charts-container">
//         {/* Encaissement */}
//         <div className="chart-card">
//           <h4>Encaissement</h4>
//           <p>Total mensuel : {new Intl.NumberFormat("fr-FR").format(totalMonthlyEncaissement)} DH</p>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={monthlyEncaissement}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#006A71" />
//             </BarChart>
//           </ResponsiveContainer>
//           <ResponsiveContainer width="100%" height={100}>
//             <LineChart data={dailyEncaissement}>
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#006A71"
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//           <p className="chart-footer">Total quotidien : {new Intl.NumberFormat("fr-FR").format(totalDailyEncaissement)} DH</p>
//         </div>

//         {/* Commission */}
//         <div className="chart-card">
//           <h4>Commission</h4>
//           <p>Total mensuel : {new Intl.NumberFormat("fr-FR").format(totalMonthlyCommission)} DH</p>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={monthlyCommiss}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#FF8C00" />
//             </BarChart>
//           </ResponsiveContainer>
//           <ResponsiveContainer width="100%" height={100}>
//             <LineChart data={dailyCommission}>
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#FF8C00"
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//           <p className="chart-footer">Total quotidien : {new Intl.NumberFormat("fr-FR").format(totalDailyCommission)} DH</p>
//         </div>

//         {/* Performance */}
//         <div className="chart-card performance-chart">
//           <h4>Suivi de la performance des gestionnaires</h4>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={montantReel} margin={{ bottom: 50 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" />
//               <YAxis />
//               <Tooltip />
//               <Legend verticalAlign="top" />
//               <Bar dataKey="objectif" name="Objectif (DH)" fill="#FF8C00" />
//               <Bar dataKey="réel" name="Réel (DH)" fill="#006A71" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default P_Commission;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./P_Commission.css";

const P_Commission = () => {
  // États pour les filtres
  const [selectedManager, setSelectedManager] = useState("Tous");
  const [selectedMonth, setSelectedMonth] = useState("Tous");
  const [monthlyEncaissement, setmonthlyEncaissement] = useState([]);
  const [monthlyCommiss, setmonthlyCommiss] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [montantReel, setMontantReel] = useState([]);
  const [tableEncaiss, setTableEncaiss] = useState([]);
  const [dailyEncaissement, setDailyEncaissement] = useState([]); // Add state for daily data
  const [dailyCommission, setDailyCommission] = useState([]); // Add state for daily commission
  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;
  const [cards, setCards] = useState({
    nombreTotalInterventions: null,
    TotalCreanceEncours: null,
    montantEncaisse: null,
    taux: null,
    retardCumule: null,
  });
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState([]);

  // Helper function to filter data by month and year
  const filterDataByDate = (data, year, month) => {
    return data.filter((item) => {
      const itemDate = new Date(item.createdAt);
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      // Filter by year
      if (year && itemYear !== parseInt(year)) {
        return false;
      }
      
      // Filter by month if not "Tous"
      if (month !== "Tous") {
        const monthNumber = monthToNumber[month];
        if (monthNumber && itemMonth !== parseInt(monthNumber)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Helper function to get objectives for a specific period
  const getObjectivesForPeriod = (objectifs, year, month) => {
    return objectifs.filter((obj) => {
      const objDate = new Date(obj.createdAt);
      const objYear = objDate.getFullYear();
      const objMonth = objDate.getMonth() + 1;
      
      if (year && objYear !== parseInt(year)) {
        return false;
      }
      
      if (month !== "Tous") {
        const monthNumber = monthToNumber[month];
        if (monthNumber && objMonth !== parseInt(monthNumber)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Helper function to process daily data from graphCommissione
  const processDailyData = (graphCommissione, year, month) => {
    const filteredData = filterDataByDate(graphCommissione, year, month);
    
    // Group by date
    const dailyMap = {};
    
    filteredData.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
      });
      
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date: date,
          montant: 0,
          commission: 0
        };
      }
      
      const montant = item.montant || 0;
      const commissionRate = item.commissione || 0;
      const commission = montant * (commissionRate / 100);
      
      dailyMap[date].montant += montant;
      dailyMap[date].commission += commission;
    });
    
    // Convert to arrays and sort by date
    const dailyEncaissement = Object.values(dailyMap)
      .map(item => ({ date: item.date, value: item.montant }))
      .sort((a, b) => new Date('2024/' + a.date) - new Date('2024/' + b.date));
      
    const dailyCommission = Object.values(dailyMap)
      .map(item => ({ date: item.date, value: item.commission }))
      .sort((a, b) => new Date('2024/' + a.date) - new Date('2024/' + b.date));
    
    return { dailyEncaissement, dailyCommission };
  };

  useEffect(() => {
    socketRef.current = io(`http://${HOST}:${PORT}`);
    const socket = socketRef.current;
    const handleConnect = () => {
      console.log("✅ Connected to socket server statistics:", socket.id);
      socket.emit("plotage_commission");
    };

    const handleData = (statis) => {
      console.log("📦 Received statistics:", statis);
      console.log("Selected filters - Year:", selectedYear, "Month:", selectedMonth);
      setStatistics(statis);
      
      // Filter data based on selected year and month
      const filteredGraphCommissions = filterDataByDate(
        statis?.graphCommissione || [], 
        selectedYear, 
        selectedMonth
      );
      
      const filteredObjectifs = getObjectivesForPeriod(
        statis?.objectifs || [], 
        selectedYear, 
        selectedMonth
      );

      // Filter encaissGestionnaire directly by date
      const filteredEncaissGestionnaire = filterDataByDate(
        statis?.encaissGestionnaire || [], 
        selectedYear, 
        selectedMonth
      );

      console.log("Filtered encaissGestionnaire:", filteredEncaissGestionnaire.length, "items");
      console.log("Filtered objectifs:", filteredObjectifs.length, "items");

      // Process daily data from graphCommissione
      const { dailyEncaissement: processedDailyEncaissement, dailyCommission: processedDailyCommission } = 
        processDailyData(statis?.graphCommissione || [], selectedYear, selectedMonth);
      
      setDailyEncaissement(processedDailyEncaissement);
      setDailyCommission(processedDailyCommission);

      // Process commission data for performance chart with filtering
      const performanceMap = {};
      
      filteredEncaissGestionnaire.forEach((item) => {
        const gestionnaireId = item.id;
        if (!performanceMap[gestionnaireId]) {
          performanceMap[gestionnaireId] = {
            id: item.id,
            name: item.username,
            réel: 0,
            objectif: 0,
          };
        }
        
        // Use Commission instead of montant_total for the réel value
        performanceMap[gestionnaireId].réel += item.Commission || 0;
      });

      // Add objectives for performance chart
      const result = Object.values(performanceMap).map((gestionnaire) => {
        const obj = filteredObjectifs.find((o) => o.gestionnaireId === gestionnaire.id) || {};
        return {
          ...gestionnaire,
          objectif: obj.newObjectif || 0,
        };
      });

      const gestionnaireMap = {};
      
      filteredEncaissGestionnaire.forEach((item) => {
        const gestionnaireId = item.id;
        if (!gestionnaireMap[gestionnaireId]) {
          gestionnaireMap[gestionnaireId] = {
            id: item.id,
            nom: item.username,
            encaissement: 0,
            commission: 0,
            objectif: 0,
          };
        }
        
        gestionnaireMap[gestionnaireId].encaissement += item.montant_total || 0;
        gestionnaireMap[gestionnaireId].commission += item.Commission || 0;
      });

      // Add objectives for each gestionnaire
      const table = Object.values(gestionnaireMap).map((gestionnaire) => {
        // Get objective for this gestionnaire in the filtered period
        const obj = filteredObjectifs.find((o) => o.gestionnaireId === gestionnaire.id) || {};
        const objectif = obj.newObjectif || 0;
        
        return {
          ...gestionnaire,
          objectif: objectif,
          taux: objectif > 0 ? (gestionnaire.commission / objectif) * 100 : 0,
        };
      });

      // Process monthly data
      const encaisss = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString("fr-FR", { month: "short" }),
        value: 0,
      }));

      const commiss = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString("fr-FR", { month: "short" }),
        value: 0,
      }));

      // Process filtered encaissGestionnaire for monthly charts
      filteredEncaissGestionnaire.forEach((item) => {
        const itemDate = new Date(item.createdAt);
        const monthIndex = itemDate.getMonth();
        const montant = item.montant_total || 0;
        const commission = item.Commission || 0;
        
        encaisss[monthIndex].value += montant;
        commiss[monthIndex].value += commission;
      });

      setmonthlyEncaissement(encaisss);
      setmonthlyCommiss(commiss);
      setMontantReel(result);
      setTableEncaiss(table.sort((a, b) => b.taux - a.taux));
      console.log("Filtered result: ", result);
      console.log("Filtered table: ", table);
    };

    const handleError = (errMsg) => {
      console.error("❌ Error received:", errMsg);
      // setError(errMsg); // Uncomment if you have error state
    };

    // Listen to socket events
    socket.on("connect", handleConnect);
    socket.on("plotage_commission", handleData);
    socket.on("plotage_commissionError", handleError);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("plotage_commission", handleData);
      socket.off("plotage_commissionError", handleError);
    };
  }, [selectedYear, selectedMonth]); // Add selectedMonth to dependencies

  // Données de synthèse
  const summary = [
    {
      label: "Nombre total d'interventions",
      value: statistics?.nombreTotalInterventions,
    },
    {
      label: "Total des créances en cours",
      value: statistics?.TotalCreanceEncours,
      suffix: " DH",
    },
    {
      label: "Montant encaissé",
      value: statistics?.montantEncaisse,
      suffix: " DH",
    },
    { label: "Retards cumulés", value: statistics?.TotalCreanceRetard, suffix: " DH" },
    {
      label: "Taux de recouvrement global",
      value:
        statistics?.taux !== undefined ? Number(statistics.taux).toFixed(1) : 0,
      suffix: " %",
    },
    {
      label: "Moyenne de traitement par gestionnaire",
      value: statistics?.moyTrait,
    },
  ];

  // Options des filtres
  const managers = [2024, 2025];
  const months = [
    "Tous",
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const monthToNumber = {
    Janvier: "01",
    Février: "02",
    Mars: "03",
    Avril: "04",
    Mai: "05",
    Juin: "06",
    Juillet: "07",
    Août: "08",
    Septembre: "09",
    Octobre: "10",
    Novembre: "11",
    Décembre: "12",
  };

  const monthlyCommission = monthlyEncaissement.map((d) => ({
    month: d.month,
    value: Math.round(d.value * 0.1),
  }));

  // Calculate totals for the filtered period
  const totalMonthlyEncaissement = monthlyEncaissement.reduce((sum, item) => sum + item.value, 0);
  const totalMonthlyCommission = monthlyCommiss.reduce((sum, item) => sum + item.value, 0);
  const totalDailyEncaissement = dailyEncaissement.reduce((sum, item) => sum + item.value, 0);
  const totalDailyCommission = dailyCommission.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-commission-page">
      {/* Cartes de synthèse */}
      <div className="stats-container">
        {summary.map((item) => (
          <div key={item.label} className="stats-card">
            <h3>{item.label}</h3>
            <p>
              {new Intl.NumberFormat("fr-FR").format(item.value)}
              {item.suffix || ""}
            </p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="controls">
        <div>
          <label>ANNEE</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {statistics?.years?.map((m, index) => (
              <option key={index} value={m.year}>
                {m.year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>MOIS</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau et bouton Actualiser */}
      <div className="table-header">
        <h2>Tableau de suivi des encaissements</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Nom et Prénom</th>
              <th>Encaissement N</th>
              <th>Commission N</th>
              <th>Objectif</th>
              <th>Taux (%)</th>
            </tr>
          </thead>
          <tbody>
            {tableEncaiss.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.nom}</td>
                <td>
                  {new Intl.NumberFormat("fr-FR").format(row.encaissement)} DH
                </td>
                <td>
                  {new Intl.NumberFormat("fr-FR").format(row.commission)} DH
                </td>
                <td>
                  {new Intl.NumberFormat("fr-FR").format(row.objectif)} DH
                </td>
                <td>{Number(row.taux).toFixed(1)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section Charts */}
      <div className="charts-container">
        {/* Encaissement */}
        <div className="chart-card">
          <h4>Encaissement</h4>
          <p>Total mensuel : {new Intl.NumberFormat("fr-FR").format(totalMonthlyEncaissement)} DH</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyEncaissement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#006A71" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={dailyEncaissement}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#006A71"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-footer">Total quotidien : {new Intl.NumberFormat("fr-FR").format(totalDailyEncaissement)} DH</p>
        </div>

        {/* Commission */}
        <div className="chart-card">
          <h4>Commission</h4>
          <p>Total mensuel : {new Intl.NumberFormat("fr-FR").format(totalMonthlyCommission)} DH</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyCommiss}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF8C00" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={dailyCommission}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FF8C00"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-footer">Total quotidien : {new Intl.NumberFormat("fr-FR").format(totalDailyCommission)} DH</p>
        </div>

        {/* Performance */}
        <div className="chart-card performance-chart">
          <h4>Suivi de la performance des gestionnaires</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={montantReel} margin={{ bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="objectif" name="Objectif (DH)" fill="#FF8C00" />
              <Bar dataKey="réel" name="Réel (DH)" fill="#006A71" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default P_Commission;