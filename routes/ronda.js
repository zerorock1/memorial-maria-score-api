const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');



router.post('/', async (req, res) => {
    const { name, sport, members } = req.body;
    const db = req.db;
    try {
      const ronda = {
        name: name,
        sport:sport,
        members: members.map(m => ({
                _id: new ObjectId(m._id),
                club: m.club,
                email: m.email,
                license: m.license,
                name: m.name,
                firstName: m.firstName,
                lastName: m.lastName,
        }))
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



module.exports = router;
