const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');




router.put('/siguiente-participante/:sport', async (req, res) => {
  const { sport } = req.params; // Obtener el ID de los parámetros de la ruta
  const { gimnasta , ronda , salto } = req.body; // Extraer datos del cuerpo de la solicitud
  const db = req.db;

  // Buscar configuración para el deporte
  const config = await db.collection('config_gimnasta').findOne({ sport: sport });

  // Verificar si la configuración existe
  if (!config) { // Cambiado a !config
    return res.status(404).send({ message: 'No se encontraron configuración para este deporte' });
  }

  try {
    // Crear un objeto de actualización
    const updateData = {
      gimnasta: gimnasta,
      ronda:ronda,
      salto:salto
    };

    // Actualizar la configuración en la base de datos
    const result = await db.collection('config_gimnasta').updateOne(
      { _id: new ObjectId(config._id) }, // Convertir _id a ObjectId si es necesario
      { $set: updateData } // Actualizar solo los campos especificados
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'No se realizaron cambios' });
    }

    res.status(200).send({
      message: 'Config actualizada con éxito',
      updatedId: config._id // Cambiado a config._id
    });
  } catch (error) {
    res.status(400).send({
      message: 'Error al actualizar la Config',
      error: error.message
    });
  }
});


router.get('/config-participante/:sport', async (req, res) => {
  const { sport } = req.params; // Obtener el ID de los parámetros de la ruta
  const db = req.db;



  try {

    const config = await db.collection('config_gimnasta').findOne({ sport: sport });

    // Verificar si la configuración existe
    if (!config) { // Cambiado a !config
      return res.status(404).send({ message: 'No se encontraron configuración para este deporte' });
    }

    res.status(200).send({
      message: 'Config actualizada con éxito',
      config: config // Cambiado a config._id
    });
  } catch (error) {
      return res.status(404).send({ message: 'No se encontraron configuración para este deporte' });
  }
});




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

  let participantes;

  try {
    // Buscar participantes donde el deporte coincida con el parámetro 'sport'
    if(sport != 'sin'){
      participantes = await db.collection('participantes')
      .find({ sport: { $in: [sport] } })
      .sort({ firstName: 1,lastName: 1 })
      .toArray();
    } else{
      participantes = await db.collection('teams')
      .find()
      .sort({ name: 1 })
      .toArray();
    }


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


router.get('/participantes-by-sport-sincro/:sport', async (req, res) => {
  const db = req.db;
  const { sport } = req.params; // Obtener el parámetro 'sport' desde la URL



  try {
    // Buscar participantes donde el deporte coincida con el parámetro 'sport'
  
      const participantes = await db.collection('participantes')
      .find({ sport: { $in: [sport] } })
      .sort({ firstName: 1,lastName: 1 })
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
