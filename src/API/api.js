// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3004'; // à adapter si besoin

export const saveUser = async (user) => {
  const endpoint = {
    Admin: '/admin/save',
    Gestionnaire: '/gestionnaire/save',
    Responsable: '/responsable/save'
  }[user.role];

  if (!endpoint) throw new Error("Rôle inconnu");

  const payload = {
    username: user.nom,
    email: user.email,
    password: user.password || 'azerty', // ou le demander dans le formulaire
    tel: user.telephone,
    address: user.adresse,
    activation: user.access === 'AUTORISÉ' ? 'Active' : 'Block',
  };

  const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });

  return response.data;
};
