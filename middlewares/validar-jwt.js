const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  //Recibir el token
  const token = req.header("x-token");
  //Si no existe el token
  if (!token) {
    return res.status(400).json({
      ok: false,
      msg: "No hay token",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    console.log(payload);

    req.uid = payload.uid;
    req.name = payload.name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }

  next();
};

module.exports = { validarJWT };
