const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const importRoute = require('../routes/importRoute');

// Mock the importController
jest.mock('../controller/importController.js', () => ({
  importData: jest.fn((req, res) => res.status(201).json([{ Gestionnaire: 'gestionnaire1', dossiers: 2, creance: 10000 }]))
}));

describe('Import Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/import', importRoute);
  });

  it('POST /import/data should import data and return results', async () => {
    const res = await request(app)
      .post('/import/data')
      .send({
        data: [
          {
            N_dossier: 'D001',
            categorie: 'A',
            capital: 5000,
            creance: 10000,
            intRetard: 100,
            Autres_frais: 50,
            duree: 12,
            mensualite: 800,
            date_premiere_echeance: '01/01/2024',
            date_derniere_echeance: '01/12/2024',
            date_Contentieux: '01/01/2025',
            debiteur_CIN: 'CIN123',
            debiteur: 'John Doe',
            debiteur_profession: 'Engineer',
            debiteur_date_naissance: '01/01/1980',
            debiteur_tel1: '0600000000',
            debiteur_tel2: '0700000000',
            debiteur_adresse: '123 Street',
            employeur: 'Company',
            employeur_adresse: 'Company Address',
            employeur_ville: 'City',
            employeur_tel1: '0611111111',
            employeur_tel2: '0622222222',
            cautionneur_CIN: 'CIN456',
            cautionneur: 'Jane Doe',
            cautionneur_adresse: '456 Avenue',
            cautionneur_ville: 'Town',
            cautionneur_tel1: '0633333333',
            cautionneur_tel2: '0644444444',
            conjoint_CIN: 'CIN789',
            conjoint_nom: 'Mary Doe',
            conjoint_adresse: '789 Road',
            conjoint_ville: 'Village',
            conjoint_tel1: '0655555555',
            conjoint_tel2: '0666666666',
            ID_Gestionnaire: '1',
            commentaire_gestionnaire: 'RAS',
            commentaire_responsable: 'RAS',
            autre: 'none'
          }
        ],
        repartitionAutomatique: 1
      })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(201);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('Gestionnaire');
    expect(res.body[0]).toHaveProperty('dossiers');
    expect(res.body[0]).toHaveProperty('creance');
  });
});
