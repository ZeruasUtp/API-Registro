const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { get } = require("http");

const userController = {
  register: async (req, res) => {
    const {
      nombre,
      email,
      contrasena,
      telefono,
      rol_id,
      membresia_id,
      activo,
    } = req.body;

    if (
      !nombre ||
      !email ||
      !contrasena ||
      !telefono ||
      !rol_id ||
      !membresia_id ||
      !activo
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const newUser = await User.create({
        nombre,
        email,
        contrasena,
        telefono,
        rol_id,
        membresia_id,
        activo,
      });

      await userController.sendConfirmationEmail({ nombre, email });

      res.status(201).json({
        message: "User created successfully",
        userId: newUser.usuario_id,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  },

  sendConfirmationEmail: async ({ nombre, email }) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirmación de Registro",
        text: `Hola ${nombre},\n\n¡Gracias por registrarte!\n\nSaludos,\nDigital Event Hub`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Correo enviado:", info.response);
    } catch (error) {
      console.error("Error enviando el correo:", error);
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    try {

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generar un token seguro
      const resetToken = user.generatePasswordReset();
      user.save();

      //URL de restablecimiento - post
      const resetUrl = `http://localhost:5000/api/reset-password/${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Restablecimiento de Contraseña",
        text: `Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña: ${resetUrl}`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent" });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res.status(500).json({ error: "Error sending reset password email" });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        where: {
          resetPasswordToken: hashedToken,
          resetPasswordExpire: {
            [Op.gt]: new Date(),
          },
        },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      user.contrasena = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();

      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Error resetting password" });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Error deleting user" });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.update(req.body);
      const updatedUser = await User.findByPk(id);

      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser});
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Error updating user" });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: "Error getting users" });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Error getting user" });
    }
  },
};

module.exports = userController;
