const Gestionnaire = require('../models/Gestionnaire.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await Gestionnaire.create({ email, password, username });
    res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email, username: user.username} });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Gestionnaire.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email, role:"GESTIONNAIRE" }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  res.json({ message: 'Login successful', token });
};
