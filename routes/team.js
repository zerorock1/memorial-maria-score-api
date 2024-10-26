const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');



// Crear un nuevo equipo
router.post('/', async (req, res) => {
  const { name, order , members } = req.body;
  const db = req.db;

  try {
    const team = {
      name: name,
      order:order,
      members: members.map(m => ({
        _id: new ObjectId(m._id),
        name: m.name,
        members: m.members
      }))
    };

    const result = await db.collection('teams').insertOne(team);
    res.status(201).send({
      message: 'Equipo creado',
      teamId: result.insertedId
    });
  } catch (error) {
    res.status(400).send({
      message: 'Error al crear el equipo',
      error: error.message
    });
  }
});

// Obtener todos los equipos
router.get('/', async (req, res) => {
  const db = req.db;
  try {
    const teams = await db.collection('teams').find().toArray();
    res.status(200).send(teams);
  } catch (error) {
    res.status(400).send({
      message: 'Error al obtener equipos',
      error: error.message
    });
  }
});

// Obtener un equipo por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  try {
    const team = await db.collection('teams').findOne({ _id: new ObjectId(id) });
    if (!team) return res.status(404).send('Equipo no encontrado');
    res.status(200).send(team);
  } catch (error) {
    res.status(400).send({
      message: 'Error al obtener el equipo',
      error: error.message
    });
  }
});


router.get('/members/:name', async (req, res) => {
  const { name } = req.params;
  const db = req.db;

  try {
    const team = await db.collection('teams').findOne({ name: name });
    if (!team) return res.status(404).send('Equipo no encontrado');
    res.status(200).send(team.members);
  } catch (error) {
    res.status(400).send({
      message: 'Error al obtener el equipo',
      error: error.message
    });
  }
});

// Actualizar un equipo por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, members } = req.body;
  const db = req.db;

  try {
    const updatedTeam = {
      name: name,
      members: members.map(m => ({
        _id: new ObjectId(m._id),
        club: m.club,
        email: m.email,
        license: m.license,
        name: m.name,
        firstName: m.firstName,
        lastName: m.lastName,
        category:m.category
      })),
    };

    const result = await db.collection('teams').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTeam }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Equipo no encontrado');
    }

    res.status(200).send({
      message: 'Equipo actualizado',
      result
    });
  } catch (error) {
    res.status(400).send({
      message: 'Error al actualizar el equipo',
      error: error.message
    });
  }
});

// Eliminar un equipo por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  try {
    const result = await db.collection('teams').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Equipo no encontrado');
    }

    res.status(200).send({
      message: 'Equipo eliminado correctamente',
    });
  } catch (error) {
    res.status(400).send({
      message: 'Error al eliminar el equipo',
      error: error.message
    });
  }
});

module.exports = router;
