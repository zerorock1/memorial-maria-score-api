const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

function calcularRankingTrampolin(data,logos) {
  // Función para calcular la puntuación de un atleta
  function calcularRankingTram(scores) {
  


    const numeroSkillsFilter = scores.filter(score => score.tipe === 'nsaltos')[0] || {}
    const dificultadFilter = scores.filter(score => score.tipe === 'dificultad')[0] || {}
    const tiempoVueloFilter = scores.filter(score => score.tipe === 'vuelo')[0] || {}
    const penalizacionFilter = scores.filter(score => score.tipe === 'penalizacion')[0] || {}
    
    const numeroSkills = numeroSkillsFilter?.score || 0;
    const dificultad = dificultadFilter?.score?.nota || 0;
    const tiempoVuelo = tiempoVueloFilter?.score?.vuelo || 0;
    const desplazamiento = tiempoVueloFilter?.score?.desp_hori || 0;
    const penalizacion = penalizacionFilter?.score || 0; 

    console.log(scores[0])

    // const juez1 = [1,2,3,4,5,5,4,3,2,1,1]
    // const juez2 = [2,2,3,4,5,5,4,3,2,1,2]
    // const juez3 = [3,2,3,4,5,5,4,3,2,1,3]
    // const juez4 = [4,2,3,4,5,5,4,3,2,1,4]

    const juez1Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 1)[0] || {}
    const juez2Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 2)[0] || {}
    const juez3Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 3)[0] || {}
    const juez4Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 4)[0] || {}

    const juez1 = Object.values(juez1Filter.score ?? {}) || [];
    const juez2 = Object.values(juez2Filter.score ?? {}) || [];
    const juez3 = Object.values(juez3Filter.score ?? {}) || [];
    const juez4 = Object.values(juez4Filter.score ?? {}) || [];


  
    let landings = [juez1[10],juez2[10],juez3[10],juez4[10]]
    landings =  landings.sort((a, b) => a - b);
  
    if (landings.length > 2) {
        landings.splice(0, 1); // Eliminar el mínimo
        landings.splice(-1, 1); // Eliminar el máximo
    }
  
    const puntuacionLanding = landings.reduce((a, b) => a + b, 0)
  
    const skills = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10']
  
    const puntuacionesTemporales = []
  
    for(let i = 0 ; i <= numeroSkills ; i++){
        let data = [juez1[i],juez2[i],juez3[i],juez4[i]];
  
        data =  data.sort((a, b) => a - b);
  
        if (data.length > 2) {
            data.splice(0, 1); // Eliminar el mínimo
            data.splice(-1, 1); // Eliminar el máximo
        }
  
        puntuacionesTemporales.push(data.reduce((a, b) => a + b, 0))
        //puntuacionesTemporales.push(obj)  
    }
    
    const sumaEjecucion = puntuacionesTemporales.reduce((a, b) => a + b, 0)+puntuacionLanding
  
    const toScore = numeroSkills*20/10
    const putuacionTotalEjecucion = toScore-(sumaEjecucion/10)

    const puntuacionFinal = ( putuacionTotalEjecucion
        + dificultad 
        + tiempoVuelo 
        + desplazamiento)
        -penalizacion
  
        
        
    return puntuacionFinal
  
  }


  const ranking = {};

  data.forEach((item) => {
      item.members.forEach(atleta => {
        const atletaId = atleta._id;
        const scores = item.scores.filter((score) => {
          let atletaIdImp = new ObjectId(atletaId)
          let scoreAtletaId =  new ObjectId(score.gimnasta._id)
          if(atletaIdImp.equals(scoreAtletaId)){
            return score
          }
        })

        let puntuacionTotal = calcularRankingTram(scores);
      
        if (isNaN(puntuacionTotal)) {
          puntuacionTotal = 0
      }

        puntuacionTotal = puntuacionTotal.toFixed(2)
        const logo = logos.filter(logo => atleta.club === logo.name)[0]?.logo || 'default.png'
        ranking[`${atleta.firstName} ${atleta.lastName}, ${atleta.name}||(${atleta.club})||${atleta.gender}||${logo}`] = puntuacionTotal;
    });
  })

  // Ordenamos el ranking por puntuación
  const rankingOrdenado = Object.entries(ranking).sort((a, b) => b[1] - a[1]);
 return rankingOrdenado;
}



function calcularRankingSincro(data,logos) { return }
function calcularRankingDoble(data,logos) { return }



router.get('/:sport', async (req, res) => {
    const sport = req.params.sport;
    const db = req.db;

    let rankings;
    
    try {

        const rondas = await db.collection('rondas').find({ sport: sport }).toArray();
        const logos = await db.collection('logos').find().toArray();
        
      switch (sport) {
        case 'trp':
          rankings = calcularRankingTrampolin(rondas,logos);
          break;

        case 'dmt':
          rankings = calcularRankingDoble(rondas,logos);
          break;

        case 'sin':
          rankings = calcularRankingSincro(rondas,logos);
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
