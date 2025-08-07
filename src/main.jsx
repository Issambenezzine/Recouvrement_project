// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
// Assuming this is the correct path

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
