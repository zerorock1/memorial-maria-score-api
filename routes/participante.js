const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');





// Obtener todos los equipos
router.get('/', async (req, res) => {
  const db = req.db;
  try {
    const teams = await db.collection('participantes').find().toArray();
    res.status(200).send(teams);
  } catch (error) {
    res.status(400).send({
      message: 'Error al obtener equipos',
      error: error.message
    });
  }
});


module.exports = router;
