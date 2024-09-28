const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');





// Obtener todos los equipos
router.get('/', async (req, res) => {
  const db = req.db;
  try {
    const teams = await db.collection('participantes').find().sort({ club: 1 }).toArray();
    res.status(200).send(teams);
  } catch (error) {
    res.status(400).send({
      message: 'Error al obtener equipos',
      error: error.message
    });
  }
});


// GET: Obtener todos los participantes por deporte
router.get('/participantes-by-sport/:sport', async (req, res) => {
  const db = req.db;
  const { sport } = req.params; // Obtener el parámetro 'sport' desde la URL

  try {
    // Buscar participantes donde el deporte coincida con el parámetro 'sport'
    const participantes = await db.collection('participantes')
    .find({ sport: { $in: [sport] } })
    .sort({ firstName: 1 })
    .toArray();

    if (participantes.length === 0) {
      return res.status(404).send({ message: 'No se encontraron participantes para este deporte' });
    }

    res.status(200).send(participantes);
  } catch (error) {
    res.status(400).send({
      message: 'Error al obtener los participantes por deporte',
      error: error.message
    });
  }
});


module.exports = router;
