const express = require("express");
const Evento = require("../models/Evento");

const getEventos = async (req, res = express.response) => {
  const eventos = await Evento.find().populate("user", "name");

  return res.json({
    ok: true,
    eventos: eventos,
  });
};

const crearEvento = async (req, res = express.response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();

    return res.json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Fallo total",
    });
  }
};

const actualizarEvento = async (req, res = express.response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "No existe ese evento",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "Sin permisos",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventId,
      nuevoEvento,
      { new: true }
    );
    return res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "FALLO TOTAL",
    });
  }
};

const eliminarEvento = async (req, res = express.response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "No existe ese evento",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "Sin permisos",
      });
    }
    const eventoBorrado = await Evento.findByIdAndDelete(eventId);

    return res.json({
      ok: true,
      eventoBorrado,
    });
    
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "FALLO TOTAL",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
