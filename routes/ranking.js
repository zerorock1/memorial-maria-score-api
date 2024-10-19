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
          const sNSkills = [];
          for (let i = 1; i <= 10; i++) {
            if(ejecucion.score[`S${i}`] != -1){
              sScores.push(ejecucion.score[`S${i}`]);
            }
            else{
              sNSkills.push(ejecucion.score[`S${i}`]);
            }
             
          }


          // Ordenamos las puntuaciones y eliminamos el mínimo y el máximo
          sScores.sort((a, b) => a - b);
          
          if (sScores.length > 2) {
              sScores.splice(0, 1); // Eliminar el mínimo
              sScores.splice(-1, 1); // Eliminar el máximo
          }

          /*
          si se hace por indices intermedios
let midIndex1 = Math.floor((combinedArray.length - 1) / 2); // Primer índice intermedio
let midIndex2 = midIndex1 + 1; // Segundo índice intermedio
*/

          const puntuacionEjecucion = sScores.reduce((a, b) => a + b, 0);

          const nota = 200 - puntuacionEjecucion; // Nota final de ejecución

          puntuaciones.push(nota);
      });

      return puntuaciones.reduce((a, b) => a + b, 0)/100; // Suma de todas las notas de ejecución
  }

  function calcularNotaDificultad(scores) {
      const dificultades = scores.filter(score => score.tipe === 'dificultad');
      return dificultades[0].score
  }

  function calcularNotaVuelo(scores) {
      const vuelos = scores.filter(score => score.tipe === 'vuelo');
      const notaVuelo = vuelos[0].score.vuelo;
      const despHori = vuelos[0].score.desp_hori;
      return notaVuelo + despHori; // Suma de notas de vuelo y desplazamiento horizontal
  }

  function calcularPenalizacion(scores) {
      const penalizaciones = scores.filter(score => score.tipe === 'penalizacion');
      return penalizaciones[0].score
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
        let puntuacionTotal = notaEjecucion + notaDificultad + notaVuelo - penalizacion;
        puntuacionTotal = puntuacionTotal.toFixed(3)    
        ranking[`${atleta.firstName} ${atleta.lastName} ${atleta.name}||(${atleta.club})||${atleta.gender}`] = puntuacionTotal;
    });
  })

  // Ordenamos el ranking por puntuación
  const rankingOrdenado = Object.entries(ranking).sort((a, b) => b[1] - a[1]);

  return rankingOrdenado;
}
  
//

function calcularRankingDoble(data) {
  // Función para calcular la puntuación de un atleta
  function calcularNotaEjecucion(scores) {
      const ejecuciones = scores.filter(score => score.tipe === 'ejecucion');
      const puntuaciones = [];

      ejecuciones.forEach(ejecucion => {
          const sScores = [];
          const sNSkills = [];
          for (let i = 1; i <= 2; i++) {
            if(ejecucion.score[`S${i}`] != -1){
              sScores.push(ejecucion.score[`S${i}`]);
            }
            else{
              sNSkills.push(ejecucion.score[`S${i}`]);
            }
             
          }


          // Ordenamos las puntuaciones y eliminamos el mínimo y el máximo
          sScores.sort((a, b) => a - b);
          
          if (sScores.length > 2) {
              sScores.splice(0, 1); // Eliminar el mínimo
              sScores.splice(-1, 1); // Eliminar el máximo
          }

          /*
          si se hace por indices intermedios
let midIndex1 = Math.floor((combinedArray.length - 1) / 2); // Primer índice intermedio
let midIndex2 = midIndex1 + 1; // Segundo índice intermedio
*/

          const puntuacionEjecucion = sScores.reduce((a, b) => a + b, 0);

          const nota = 800 - puntuacionEjecucion; // Nota final de ejecución

          if(nota < 100){
            nota  = 100;
          }

          puntuaciones.push(nota);
      });

      return puntuaciones.reduce((a, b) => a + b, 0)/100; // Suma de todas las notas de ejecución
  }

  function calcularNotaDificultad(scores) {
      const dificultades = scores.filter(score => score.tipe === 'dificultad');
      return dificultades[0].score
  }

  function calcularNotaVuelo(scores) {
      const vuelos = scores.filter(score => score.tipe === 'vuelo');
      const notaVuelo = vuelos[0].score.vuelo;
      const despHori = vuelos[0].score.desp_hori;
      return notaVuelo + despHori; // Suma de notas de vuelo y desplazamiento horizontal
  }

  function calcularPenalizacion(scores) {
      const penalizaciones = scores.filter(score => score.tipe === 'penalizacion');
      return penalizaciones[0].score
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
        let puntuacionTotal = notaEjecucion + notaDificultad + notaVuelo - penalizacion;
        puntuacionTotal = puntuacionTotal.toFixed(3)    
        ranking[`${atleta.firstName} ${atleta.lastName} ${atleta.name}||(${atleta.club})||${atleta.gender}`] = puntuacionTotal;
    });
  })

  // Ordenamos el ranking por puntuación
  const rankingOrdenado = Object.entries(ranking).sort((a, b) => b[1] - a[1]);

  return rankingOrdenado;
}
//
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
