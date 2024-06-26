// services/userService.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

class UserService {
  static async registerUser({ nombre, email, contraseña, confirma }) {
    if (contraseña !== confirma) {
      throw new Error('Las contraseñas no coinciden');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    await User.create({ nombre, email, contraseña: hashedPassword });

    await UserService.sendConfirmationEmail({ nombre, email });

    return { message: 'Usuario registrado con éxito' };
  }

  static async sendConfirmationEmail({ nombre, email }) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmación de Registro',
      text: `Hola ${nombre},\n\n¡Gracias por registrarte!\n\nSaludos,\nDigital Event Hub`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  }
}

module.exports = UserService;
