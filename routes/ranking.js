const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

function calcularRankingTrampolin(data) {
  // Función para calcular la puntuación de un atleta
  function calcularNotaEjecucion(scores) {
      const ejecuciones = scores.filter(score => score.tipe === 'ejecucion');
      const puntuaciones = [];

      ejecuciones.forEach(ejecucion => {
          const sScores = [];
          for (let i = 1; i <= 10; i++) {
              sScores.push(ejecucion.score[`S${i}`]);
          }
          // Ordenamos las puntuaciones y eliminamos el mínimo y el máximo
          sScores.sort((a, b) => a - b);
          
          if (sScores.length > 2) {
              sScores.splice(0, 1); // Eliminar el mínimo
              sScores.splice(-1, 1); // Eliminar el máximo
          }
          const puntuacionEjecucion = sScores.reduce((a, b) => a + b, 0);
          const nota = 20 - puntuacionEjecucion; // Nota final de ejecución
          puntuaciones.push(nota);
      });

      return puntuaciones.reduce((a, b) => a + b, 0); // Suma de todas las notas de ejecución
  }

  function calcularNotaDificultad(scores) {
      const dificultades = scores.filter(score => score.tipe === 'dificultad');
      return dificultades.reduce((sum, score) => sum + score.score.nota, 0); // Sumar todas las notas de dificultad
  }

  function calcularNotaVuelo(scores) {
      const vuelos = scores.filter(score => score.tipe === 'vuelo');
      const notaVuelo = vuelos.reduce((sum, vuelo) => sum + vuelo.score.vuelo, 0);
      const despHori = vuelos.reduce((sum, vuelo) => sum + vuelo.score.desp_hori, 0);
      return notaVuelo + despHori; // Suma de notas de vuelo y desplazamiento horizontal
  }

  function calcularPenalizacion(scores) {
      const penalizaciones = scores.filter(score => score.tipe === 'penalizacion');
      return penalizaciones.reduce((sum, score) => sum + score.score.penalizacion, 0); // Sumar todas las penalizaciones
  }

  const ranking = {};


  data.forEach((item) => {
      item.members.forEach(atleta => {
        const atletaId = atleta._id.$oid;

        const scores = item.scores.filter(score => score.gimnasta._id.$oid === atletaId);
        
        const notaEjecucion = calcularNotaEjecucion(scores);
        const notaDificultad = calcularNotaDificultad(scores);
        const notaVuelo = calcularNotaVuelo(scores);
        const penalizacion = calcularPenalizacion(scores);
    
        const puntuacionTotal = notaEjecucion + notaDificultad + notaVuelo - penalizacion;
    
        ranking[`${atleta.firstName} ${atleta.lastName} ${atleta.name}||(${atleta.club})`] = puntuacionTotal;
    });
  })

  // Ordenamos el ranking por puntuación
  const rankingOrdenado = Object.entries(ranking).sort((a, b) => b[1] - a[1]);

  return rankingOrdenado;
}
  

function calcularRankingDoble(data) { return }
function calcularRankingSincro(data) { return }

router.get('/:sport', async (req, res) => {
    const sport = req.params.sport;
    const db = req.db;

    let rankings;
    
    try {

        const rondas = await db.collection('rondas').find({ sport: sport }).toArray();
        
      switch (sport) {
        case 'trp':
          rankings = calcularRankingTrampolin(rondas);
          break;

        case 'dmt':
          rankings = calcularRankingDoble(rondas);
          break;

        case 'sin':
          rankings = calcularRankingSincro(rondas);
          break;
      }
        


        

        res.status(200).send(rankings);
      } catch (error) {
        res.status(400).send({
          message: 'Error al calcular clasificación',
          error: error.message
        });
      }
});



module.exports = router;
