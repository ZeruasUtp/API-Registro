const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // Asegúrate de requerir crypto

const User = sequelize.define(
  "Usuarios",
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("contrasena", hashedPassword);
      },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    membresia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Nuevos campos para el restablecimiento de contraseña
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      allowNull: true,
    },
  },
  {
    tableName: "Usuarios",
    timestamps: false,
  }
);

// Método para generar el token de restablecimiento de contraseña
User.prototype.generatePasswordReset = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash el token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 3600000; // 1 h
  return resetToken;
};

module.exports = User;
