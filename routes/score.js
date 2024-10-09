const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Eliminar un score por su _id
router.delete('/:rondaId/score/:scoreId', async (req, res) => {
  const { rondaId, scoreId } = req.params;
  const db = req.db;

  try {
    // Buscar la ronda y eliminar el score por su _id
    const result = await db.collection('rondas').updateOne(
      { _id: new ObjectId(rondaId) }, // Filtrar por el ID de la ronda
      { $pull: { scores: { _id: new ObjectId(scoreId) } } } // Eliminar el score con el ID correspondiente
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'Ronda o score no encontrado' });
    }

    res.status(200).send({ message: 'Score eliminado con éxito' });
  } catch (error) {
    res.status(500).send({ message: 'Error al eliminar el score', error: error.message });
  }
});

// Actualizar el campo "verified" de un score por su _id
router.put('/:rondaId/score/:scoreId/verify', async (req, res) => {
  const { rondaId, scoreId } = req.params;
  const { verify } = req.body; // Se espera que el cuerpo de la solicitud contenga el valor de verified
  const db = req.db;


  try {

    // Asegurarse de que los IDs sean ObjectId válidos
    const rondaObjectId = new ObjectId(rondaId);
    const scoreObjectId = new ObjectId(scoreId);

    // Actualizar el campo "verified" del score
    const result = await db.collection('rondas').updateOne(
      { _id: rondaObjectId, 'scores._id': scoreObjectId }, // Filtrar por ronda y score ID
      { $set: { 'scores.$.verified': verify } } // Actualizar el campo verified del score correspondiente
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'No se realizó ningún cambio' });
    }

    res.status(200).send({ message: 'Score actualizado con éxito' });
  } catch (error) {
    res.status(500).send({ message: 'Error al actualizar el score', error: error.message });
  }
});

module.exports = router;