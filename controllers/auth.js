//Callbacks para las rutas de autentificación.

const express = require("express");
const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = express.response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email: email });

    //Si  existe mandamos error
    if (usuario) {
      return res.status(400).json({ ok: false, msg: "El email ya existe" });
    }

    //Creamos un nuevo usuario con el body
    usuario = new Usuario(req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Lo guarda en la bd
    await usuario.save();

    //GENERAR Json TOKEN
    const token = await generarJWT(usuario.id, usuario.name);

    return res
      .status(201)
      .json({ ok: true, uid: usuario.id, name: usuario.name, token: token });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Error Fatal",
    });
  }
};

const loginUsuario = async (req, res = express.response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email: email });

    //Si  no existe mandamos error
    if (!usuario) {
      return res.status(400).json({ ok: false, msg: "El email no existe" });
    }

    //Comparar contraseñas, la primera es la que mandamos
    //y la otra viene de la BD
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    //generar el json token
    const token = await generarJWT(usuario.id, usuario.name);

    return res
      .status(200)
      .json({ ok: true, uid: usuario.id, name: usuario.name, token: token });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Error Fatal",
    });
  }
};

const revalidarToken = async (req, res = express.response) => {
  const uid = req.uid;
  const name = req.name;


  const token = await generarJWT(uid,name);
  return res.json({ ok: true, uid, name, token });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };
