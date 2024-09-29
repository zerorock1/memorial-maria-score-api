const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');




router.post('/', async (req, res) => {
  const { name, sport, final, members, scores } = req.body;
  const db = req.db;
  try {
    const ronda = {
      name: name,
      sport:sport,
      final:final,
      members: members.map(m => ({
              _id: new ObjectId(m._id),
              club: m.club,
              email: m.email,
              license: m.license,
              name: m.name,
              firstName: m.firstName,
              lastName: m.lastName,
      })),
      scores:[],
    };
    const result = await db.collection('rondas').insertOne(ronda);
    res.status(201).send({
      message: 'Ronda creado',
      teamId: result.insertedId
    });
  } catch (error) {
    res.status(400).send({
      message: 'Error al crear la ronda',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  const db = req.db;
  try {
    const teams = await db.collection('rondas').find().toArray();
    res.status(200).send(teams);
  } catch (error) {
    res.status(400).send({
      message: 'Error al obtener equipos',
      error: error.message
    });
  }
});


// GET: Obtener una ronda por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.db;
  try {
    // Validar y convertir el ID a ObjectId
    const objectId = new ObjectId(id);
    
    // Buscar la ronda por su ID
    const ronda = await db.collection('rondas').findOne({ _id: objectId });

    if (!ronda) {
      return res.status(404).send({ message: 'Ronda no encontrada' });
    }

    res.status(200).send(ronda);
  } catch (error) {
    res.status(400).send({
      message: 'Error al obtener la ronda',
      error: error.message
    });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params; // Obtener el ID de los parámetros de la ruta
  const { name, members , scores  } = req.body; // Extraer datos del cuerpo de la solicitud
  const db = req.db;

  try {
      // Crear un objeto de actualización
      const updateData = {
          name,
          members: members.map(m => ({
              _id: new ObjectId(m._id),
              club: m.club,
              email: m.email,
              license: m.license,
              name: m.name,
              firstName: m.firstName,
              lastName: m.lastName,
              category:m.category,
              gender:m.gender
          })),
          scores: scores
        
      };

      // Actualizar la ronda en la base de datos
      const result = await db.collection('rondas').updateOne(
          { _id: new ObjectId(id) }, // Filtrar por ID
          { $set: updateData } // Actualizar solo los campos especificados
      );

      if (result.modifiedCount === 0) {
          return res.status(404).send({ message: 'Ronda no encontrada o no se realizaron cambios' });
      }

      res.status(200).send({
          message: 'Ronda actualizada con éxito',
          updatedId: id
      });
  } catch (error) {
      res.status(400).send({
          message: 'Error al actualizar la ronda',
          error: error.message
      });
  }
});



module.exports = router;
