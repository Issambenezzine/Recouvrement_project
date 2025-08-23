const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const gestionnaireRoute = require('../routes/gestionnaireRoute');

// Mock dependencies
jest.mock('../controller/gestionnaireController.js', () => ({
  saveGestionnaire: jest.fn((req, res) => res.status(200).json({ id: 1, username: 'gestionnaire', email: 'g@email.com' })),
  updateGestionnaire: jest.fn((req, res) => res.status(200).json({ message: 'Gestionnaire is successfully updated' })),
  deleteGestionnaire: jest.fn((req, res) => res.status(200).json({ message: 'Gestionnaire is successfully deleted' })),
  blockGestionnaire: jest.fn((req, res) => res.status(200).json({ message: 'User updated successfully' })),
  activerGestionnaire: jest.fn((req, res) => res.status(200).json({ message: 'User updated successfully' })),
}));
jest.mock('../middlewares/auth.js', () => ({
  authorize: (req, res, next) => {
    req.user = { id: 1, username: 'admin', role: 'ADMIN' };
    req.role = 'ADMIN';
    next();
  },
}));

describe('Gestionnaire Routes', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/gestionnaire', gestionnaireRoute);
  });

  it('POST /gestionnaire/save should create a gestionnaire', async () => {
    const res = await request(app)
      .post('/gestionnaire/save')
      .send({ username: 'gestionnaire', email: 'g@email.com', password: 'pass', tel: '123', addresse: 'address', activation: 'Active' })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('gestionnaire');
  });

  it('PUT /gestionnaire/update should update a gestionnaire', async () => {
    const res = await request(app)
      .put('/gestionnaire/update')
      .send({ id: 1, email: 'new@email.com' })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Gestionnaire is successfully updated');
  });

  it('DELETE /gestionnaire/delete should delete a gestionnaire', async () => {
    const res = await request(app)
      .delete('/gestionnaire/delete')
      .send({ id: 1 })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Gestionnaire is successfully deleted');
  });

  it('PUT /gestionnaire/block should block a gestionnaire', async () => {
    const res = await request(app)
      .put('/gestionnaire/block')
      .send({ id: 1 })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User updated successfully');
  });

  it('PUT /gestionnaire/active should activate a gestionnaire', async () => {
    const res = await request(app)
      .put('/gestionnaire/active')
      .send({ id: 1 })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User updated successfully');
  });
});
