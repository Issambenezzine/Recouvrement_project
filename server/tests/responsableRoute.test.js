const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const responsableRoute = require('../routes/responsableRoute');

// Mock dependencies
jest.mock('../controller/responsableController.js', () => ({
  saveResponsable: jest.fn((req, res) => res.status(200).json({ id: 1, username: 'responsable', email: 'r@email.com' })),
  updateResponsable: jest.fn((req, res) => res.status(200).json({ message: 'Responsable is successfully updated' })),
  deleteResponsable: jest.fn((req, res) => res.status(200).json({ message: 'Responsable is successfully deleted' })),
  blockResponsable: jest.fn((req, res) => res.status(200).json({ message: 'User updated successfully' })),
  activerResponsable: jest.fn((req, res) => res.status(200).json({ message: 'User updated successfully' })),
}));
jest.mock('../middlewares/auth.js', () => ({
  authorize: (req, res, next) => {
    req.user = { id: 1, username: 'admin', role: 'ADMIN' };
    req.role = 'ADMIN';
    next();
  },
}));

describe('Responsable Routes', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/responsable', responsableRoute);
  });

  it('POST /responsable/save should create a responsable', async () => {
    const res = await request(app)
      .post('/responsable/save')
      .send({ username: 'responsable', email: 'r@email.com', password: 'pass', tel: '123', addresse: 'address', activation: 'Active' })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('responsable');
  });

  it('PUT /responsable/update should update a responsable', async () => {
    const res = await request(app)
      .put('/responsable/update')
      .send({ id: 1, email: 'new@email.com' })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Responsable is successfully updated');
  });

  it('DELETE /responsable/delete should delete a responsable', async () => {
    const res = await request(app)
      .delete('/responsable/delete')
      .send({ id: 1 })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Responsable is successfully deleted');
  });

  it('PUT /responsable/block should block a responsable', async () => {
    const res = await request(app)
      .put('/responsable/block')
      .send({ id: 1 })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User updated successfully');
  });

  it('PUT /responsable/active should activate a responsable', async () => {
    const res = await request(app)
      .put('/responsable/active')
      .send({ id: 1 })
      .set('Cookie', ['token=mocktoken']);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User updated successfully');
  });
});
