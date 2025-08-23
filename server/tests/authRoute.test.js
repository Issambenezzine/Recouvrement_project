const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('../routes/authRoute');

// Mock dependencies
jest.mock('../controller/authController.js', () => ({
  login_post: jest.fn((req, res) => res.status(200).json({ message: 'Logged in', role: 'GESTIONNAIRE', name: 'testuser', email: 'test@email.com' })),
  logout: jest.fn((req, res) => res.status(200).json({ message: 'Logged out successfully' })),
}));
jest.mock('../controller/gestionnaireController.js', () => ({
  getGestionnairesData: jest.fn((req, res) => res.status(200).json({ id: 1, username: 'gestionnaire', email: 'g@email.com', tel: '123', dateEmb: '2023-01-01' })),
}));
jest.mock('../controller/adminController.js', () => ({
  getAdminData: jest.fn((req, res) => res.status(200).json({ id: 2, username: 'admin', email: 'admin@email.com' })),
}));
jest.mock('../controller/responsableController.js', () => ({
  getResponsableData: jest.fn((req, res) => res.status(200).json({ id: 3, username: 'responsable', email: 'r@email.com' })),
}));
jest.mock('../middlewares/auth.js', () => ({
  authorize: (req, res, next) => {
    req.user = { id: 1, username: 'test', role: 'ADMIN' };
    req.role = 'ADMIN';
    next();
  },
}));

describe('Auth Routes', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/auth', authRoute);
  });

  it('POST /auth/login should login user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@email.com', password: 'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged in');
  });

  it('POST /auth/logout should logout user', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });

  it('GET /auth/dashboard should return gestionnaire data', async () => {
    const res = await request(app)
      .get('/auth/dashboard')
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('gestionnaire');
  });

  it('GET /auth/Admin should return admin data', async () => {
    const res = await request(app)
      .get('/auth/Admin')
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('admin');
  });

  it('GET /auth/responsable should return responsable data', async () => {
    const res = await request(app)
      .get('/auth/responsable')
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('responsable');
  });
});
