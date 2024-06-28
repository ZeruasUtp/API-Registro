const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/userModel'); 

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');

    const user = await Usuario.findByPk(decoded.usuario_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.usuario = user;
    next();
  } catch (err) {
    console.error('Failed to authenticate token:', err);
    return res.status(500).json({ error: 'Failed to authenticate token' });
  }
};

module.exports = authMiddleware;
