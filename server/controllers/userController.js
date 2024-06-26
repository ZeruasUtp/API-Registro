// controllers/userController.js
const UserService = require('../services/userService');

class UserController {
  static async registerUser(req, res) {
    const { nombre, email, contraseña, confirma } = req.body;

    try {
      const result = await UserService.registerUser({ nombre, email, contraseña, confirma });
      res.status(201).json(result);
    } catch (err) {
      console.error('Server error:', err);
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = UserController;
