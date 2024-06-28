const User = require('../models/userModel');

const userController = {
  register: async (req, res) => {
    const { nombre, email, last_name, contrasena, telefono, rol_id } = req.body;

    if (!nombre || !email || !last_name || !contrasena || !telefono || !rol_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const newUser = await User.create({
        nombre,
        email,
        last_name,
        contrasena,
        telefono,
        rol_id,
      });

      res.status(201).json({ message: 'User created successfully', userId: newUser.usuario_id });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  }
};

module.exports = userController;
