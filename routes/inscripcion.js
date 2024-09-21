const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { 
    tipo,    
    club,
    clubPhone,
    email,
    license,
    name,
    firstName,
    lastName,
    category,
    gender,
    sport } = req.body;

  if (
    !tipo ||
    !club ||
    !clubPhone ||
    !email ||
    !license ||
    !name ||
    !firstName ||
    !lastName ||
    !gender
  ) {
    return res.status(400).json({
      message: 'Error al crear el participante',
      error: 'Todos los campos son obligatorios',  // opcional: puedes incluir detalles del error
    });
  }

  // if (!['atleta', 'entrenador'].includes(tipo)) {
  //   return res.status(400).send('Invalid tipo. Must be "atleta" or "entrenador"');
  // }

  // if (!['masculino', 'femenino'].includes(genero)) {
  //   return res.status(400).send('Invalid genero. Must be "masculino" or "femenino"');
  // }

  try {
    const db = req.db;
    const result = await db.collection('participantes').insertOne({
      tipo,
      club,
      clubPhone,
      email,
      license,
      name,
      firstName,
      lastName,
      category,
      gender,
      sport,
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Se ha creado un nuevo registro',
      id: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el participante',
      error: error.message,  // opcional: puedes incluir detalles del error
    });
  }
});

module.exports = router;
