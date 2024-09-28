const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');


const calculateRankings = (sport, rounds) => {
  const scoresByAthlete = {};

  rounds.forEach(round => {
    if (round.sport === sport) {
      round.scores.forEach(scoreEntry => {
        const athleteId = scoreEntry.gimnasta._id;
        const scoreValues = Object.values(scoreEntry.score);

        const totalScore = scoreValues.reduce((acc, score) => acc + score, 0);

        if (scoresByAthlete[athleteId]) {
          scoresByAthlete[athleteId].total += totalScore;
          scoresByAthlete[athleteId].scores.push(...scoreValues);
        } else {
          scoresByAthlete[athleteId] = {
            athlete: scoreEntry.gimnasta,
            total: totalScore,
            scores: [...scoreValues]
          };
        }
      });
    }
  });

  // Function to calculate median
  const calculateMedian = (scores) => {
    const sortedScores = scores.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedScores.length / 2);

    if (sortedScores.length % 2 === 0) {
      return (sortedScores[mid - 1] + sortedScores[mid]) / 2;
    } else {
      return sortedScores[mid];
    }
  };

  // Function to calculate mean (average)
  const calculateMean = (scores) => {
    const total = scores.reduce((acc, score) => acc + score, 0);
    return total / scores.length;
  };

  // Add median and mean to each athlete's scores and then sort by total score
  const rankings = Object.values(scoresByAthlete).map(athleteData => {
    const median = calculateMedian(athleteData.scores);
    const mean = calculateMean(athleteData.scores);
    return {
      ...athleteData,
      median,
      mean
    };
  }).sort((a, b) => b.total - a.total);

  return rankings;
};





  


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
  const { name, members , scores } = req.body; // Extraer datos del cuerpo de la solicitud
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
              category:m.category
          })),
          scores: scores // Si necesitas actualizar scores, puedes hacerlo aquí
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
