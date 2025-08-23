const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const encaissementController = require('../controller/encaissementController');

// Mock models
jest.mock('../models/Encaissement.js', () => ({
  create: jest.fn(async (data) => ({ id: 1, ...data })),
  findAll: jest.fn(async () => [{ id: 1, montant: 100 }]),
}));
jest.mock('../models/Piece_jointe.js', () => ({
  create: jest.fn(async (data) => ({ id: 1, ...data })),
}));

const Encaissement = require('../models/Encaissement.js');
const Piece_jointe = require('../models/Piece_jointe.js');

describe('encaissementController', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/encaissement', (req, res) => {
      req.role = req.headers['role'] || 'ADMIN';
      return encaissementController.addEncaissement(req, res);
    });
    app.post('/piece-jointe', (req, res) => {
      req.role = req.headers['role'] || 'ADMIN';
      return encaissementController.uploadPieceJointe(req, res);
    });
    app.get('/encaissement', (req, res) => {
      return encaissementController.getEncaissement(req, res);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add an encaissement', async () => {
    const res = await request(app)
      .post('/encaissement')
      .send({ modeReg: 'cash', typeReg: 'type', montant: 100, dateReg: '2025-07-28', responsable: 'admin', dossierId: 1 })
      .set('role', 'ADMIN');
    expect(res.statusCode).toBe(201);
    expect(res.body.montant).toBe(100);
    expect(Encaissement.create).toHaveBeenCalled();
  });

  it('should not add encaissement for VISITEUR', async () => {
    const res = await request(app)
      .post('/encaissement')
      .send({})
      .set('role', 'VISITEUR');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Vous n'êtes pas autorisé");
  });

  it('should upload a piece jointe', async () => {
    const res = await request(app)
      .post('/piece-jointe')
      .send({ encaissementId: 1, description: 'desc', responsable: 'admin', action: 'act', nomPiece: 'file.pdf', src_image: 'img', dossierId: 1 })
      .set('role', 'ADMIN');
    expect(res.statusCode).toBe(201);
    expect(res.body.nomPiece).toBe('file.pdf');
    expect(Piece_jointe.create).toHaveBeenCalled();
  });

  it('should not upload piece jointe for VISITEUR', async () => {
    const res = await request(app)
      .post('/piece-jointe')
      .send({})
      .set('role', 'VISITEUR');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Vous n'êtes pas autorisé");
  });

  it('should get encaissements', async () => {
    const res = await request(app).get('/encaissement');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(Encaissement.findAll).toHaveBeenCalled();
  });
});
