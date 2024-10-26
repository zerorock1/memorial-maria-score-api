const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

function calcularRankingTrampolin(data,logos) {
  // Función para calcular la puntuación de un atleta
  function calcularRankingTram(scores,dataName) {
  



    const numeroSkillsFilter = scores.filter(score => score.tipe === 'nsaltos')[0] || {}
    const dificultadFilter = scores.filter(score => score.tipe === 'dificultad')[0] || {}
    const tiempoVueloFilter = scores.filter(score => score.tipe === 'vuelo')[0] || {}
    const penalizacionFilter = scores.filter(score => score.tipe === 'penalizacion')[0] || {}
    
    const numeroSkills = numeroSkillsFilter?.score || 0;
    const dificultad = dificultadFilter?.score?.nota || 0;
    const tiempoVuelo = tiempoVueloFilter?.score?.vuelo || 0;
    const desplazamiento = tiempoVueloFilter?.score?.desp_hori || 0;
    const penalizacion = penalizacionFilter?.score || 0; 

    let juez1Filter = {}
    let juez2Filter = {}
    let juez3Filter = {}
    let juez4Filter = {}

    let juez1 = [];
    let juez2 = [];
    let juez3 = [];
    let juez4 = [];
    let puntuacionFinal = 0
    let landings = []  
    let puntuacionLanding = 0
    let skills = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10']
    let puntuacionesTemporales = []
    let sumaEjecucion = 0
    let toScore = 0
    let all_data = []

    if(dataName.split(' ')[0] === 'BASE' || dataName.split(' - ')[0] === 'ELITE C TRP FEMENINO'){



      juez1Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 1)[0] || {}
      juez2Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 2)[0] || {}

  
      juez1 = Object.values(juez1Filter.score ?? {}) || [];
      juez2 = Object.values(juez2Filter.score ?? {}) || [];


  
    
      landings = [juez1[10],juez2[10]]    
      puntuacionLanding = landings.reduce((a, b) => a + b, 0)
      


    
      for(let i = 0 ; i <= numeroSkills-1 ; i++){
          let data = [juez1[i],juez2[i]];   
    
          puntuacionesTemporales.push(data.reduce((a, b) => a + b, 0))
          //puntuacionesTemporales.push(obj)  
      }

      
      sumaEjecucion = puntuacionesTemporales.reduce((a, b) => a + b, 0)+puntuacionLanding
    
      toScore = numeroSkills*20/10
      putuacionTotalEjecucion = toScore-(sumaEjecucion/10)
  
      puntuacionFinal = ( putuacionTotalEjecucion
          + dificultad 
          + tiempoVuelo 
          + desplazamiento)
          -penalizacion



    }
    else{

    juez1Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 1)[0] || {}
    juez2Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 2)[0] || {}
    juez3Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 3)[0] || {}
    juez4Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 4)[0] || {}

    juez1 = Object.values(juez1Filter.score ?? {}) || [];
    juez2 = Object.values(juez2Filter.score ?? {}) || [];
    juez3 = Object.values(juez3Filter.score ?? {}) || [];
    juez4 = Object.values(juez4Filter.score ?? {}) || [];

  
    landings = [juez1[10],juez2[10],juez3[10],juez4[10]]
    landings =  landings.sort((a, b) => a - b);
  
    if (landings.length > 2) {
        landings.splice(0, 1); // Eliminar el mínimo
        landings.splice(-1, 1); // Eliminar el máximo
    }
  
    puntuacionLanding = landings.reduce((a, b) => a + b, 0)

    puntuacionesTemporales = []
  
    for(let i = 0 ; i <= numeroSkills-1 ; i++){
        let data = [juez1[i],juez2[i],juez3[i],juez4[i]];
  
        data =  data.sort((a, b) => a - b);
  
        if (data.length > 2) {
            data.splice(0, 1); // Eliminar el mínimo
            data.splice(-1, 1); // Eliminar el máximo
        }
  
      
        puntuacionesTemporales.push(data.reduce((a, b) => a + b, 0))
        //puntuacionesTemporales.push(obj)  
    }

    
    sumaEjecucion = puntuacionesTemporales.reduce((a, b) => a + b, 0)+puntuacionLanding
  
    toScore = numeroSkills*20/10
    putuacionTotalEjecucion = toScore-(sumaEjecucion/10)

    puntuacionFinal = ( putuacionTotalEjecucion
        + dificultad 
        + tiempoVuelo 
        + desplazamiento)
        -penalizacion
    }
        
    
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

        let puntuacionTotal = calcularRankingTram(scores,item.name);
      
        if (isNaN(puntuacionTotal)) {
          puntuacionTotal = 0
      }

        puntuacionTotal = puntuacionTotal.toFixed(2)
        
        const logo = logos.filter(logo => atleta.club === logo.name)[0]?.logo || 'default.png'
        ranking[`${atleta.firstName} ${atleta.lastName}, ${atleta.name}||(${atleta.club})||${atleta.gender}||${logo}||${item.name}||${createSlug(item.name)}`] = puntuacionTotal;
    });
  })

  // Ordenamos el ranking por puntuación
  const rankingOrdenado = Object.entries(ranking).sort((a, b) => b[1] - a[1]);
 return rankingOrdenado;
}


function calcularRankingSincro(data,logos) {
  // Función para calcular la puntuación de un atleta
  function calcularRankingTram(scores,dataName) {
  



    const numeroSkillsFilter = scores.filter(score => score.tipe === 'nsaltos')[0] || {}
    const dificultadFilter = scores.filter(score => score.tipe === 'dificultad')[0] || {}
    const tiempoVueloFilter = scores.filter(score => score.tipe === 'vuelo')[0] || {}
    const penalizacionFilter = scores.filter(score => score.tipe === 'penalizacion')[0] || {}
    
    const numeroSkills = numeroSkillsFilter?.score || 0;
    const dificultad = dificultadFilter?.score?.nota || 0;
    const tiempoVuelo = tiempoVueloFilter?.score?.vuelo || 0;
    const desplazamiento = tiempoVueloFilter?.score?.desp_hori || 0;
    const penalizacion = penalizacionFilter?.score || 0; 

    let juez1Filter = {}
    let juez2Filter = {}
    let juez3Filter = {}
    let juez4Filter = {}

    let juez1 = [];
    let juez2 = [];
    let juez3 = [];
    let juez4 = [];
    let puntuacionFinal = 0
    let landings = []  
    let puntuacionLanding = 0
    let skills = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10']
    let puntuacionesTemporales = []
    let sumaEjecucion = 0
    let toScore = 0
    let all_data = []



    juez1Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 1)[0] || {}
    juez2Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 2)[0] || {}
    juez3Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 3)[0] || {}
    juez4Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 4)[0] || {}

    juez1 = Object.values(juez1Filter.score ?? {}) || [];
    juez2 = Object.values(juez2Filter.score ?? {}) || [];
    juez3 = Object.values(juez3Filter.score ?? {}) || [];
    juez4 = Object.values(juez4Filter.score ?? {}) || [];



  
    landings = [juez1[10],juez2[10],juez3[10],juez4[10]]
    landings =  landings.sort((a, b) => a - b);

    
  
    if (landings.length > 2) {
        landings.splice(0, 1); // Eliminar el mínimo
        landings.splice(-1, 1); // Eliminar el máximo
    }
  
  
    puntuacionLanding = landings.reduce((a, b) => a + b, 0) / landings.length



    puntuacionesTemporales = []
  
    for(let i = 0 ; i <= numeroSkills-1 ; i++){
      let data = [
        juez1[i] || 0,
        juez2[i] || 0,
        juez3[i] || 0,
        juez4[i] || 0
      ];
  
        data =  data.sort((a, b) => a - b);
  
        if (data.length > 2) {
            data.splice(0, 1); // Eliminar el mínimo
            data.splice(-1, 1); // Eliminar el máximo
        }
  
      
      
        puntuacionesTemporales.push((data.reduce((a, b) => a + b, 0) / data.length))
        //puntuacionesTemporales.push(obj)  
    }



    
    
    sumaEjecucion = puntuacionesTemporales.reduce((a, b) => a + b, 0)+puntuacionLanding
  
    toScore = numeroSkills*10/10
    putuacionTotalEjecucion = toScore-(sumaEjecucion/10)

    puntuacionFinal = ( putuacionTotalEjecucion
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

        let puntuacionTotal = calcularRankingTram(scores,item.name);
      
        if (isNaN(puntuacionTotal)) {
          puntuacionTotal = 0
      }

        puntuacionTotal = puntuacionTotal.toFixed(3)
        
        const logo = logos.filter(logo => atleta.club === logo.name)[0]?.logo || 'default.png'
        ranking[`${atleta.firstName} ${atleta.lastName}, ${atleta.name}||(${atleta.club})||${atleta.gender}||${logo}||${item.name}||${createSlug(item.name)}`] = puntuacionTotal;
    });
  })

  // Ordenamos el ranking por puntuación
  const rankingOrdenado = Object.entries(ranking).sort((a, b) => b[1] - a[1]);
 return rankingOrdenado;
}


function calcularRankingDoble(data,logos) {
  // Función para calcular la puntuación de un atleta
  function calcularRankingTram(scores,dataName) {
  



    const numeroSkillsFilter = scores.filter(score => score.tipe === 'nsaltos')[0] || {}
    const numeroSkillsFilter_dos = scores.filter(score => score.tipe === 'nsaltos')[1] || {}
    const dificultadFilter = scores.filter(score => score.tipe === 'dificultad')[0] || {}
    const dificultadFilter_dos = scores.filter(score => score.tipe === 'dificultad')[1] || {}
    const tiempoVueloFilter = scores.filter(score => score.tipe === 'vuelo')[0] || {}
    const tiempoVueloFilter_dos = scores.filter(score => score.tipe === 'vuelo')[1] || {}
    const penalizacionFilter = scores.filter(score => score.tipe === 'penalizacion')[0] || {}
    const penalizacionFilter_dos = scores.filter(score => score.tipe === 'penalizacion')[1] || {}

    
    
    const numeroSkills = numeroSkillsFilter?.score || 0;
    const numeroSkills_dos = numeroSkillsFilter_dos?.score || 0;


    const dificultad = dificultadFilter?.score?.nota || 0;
    const penalizacion = penalizacionFilter?.score || 0; 
    const dificultad_dos = dificultadFilter_dos?.score?.nota || 0;
    const penalizacion_dos = penalizacionFilter_dos?.score || 0; 
    


    let juez1Filter = {}
    let juez2Filter = {}
    let juez3Filter = {}
    let juez4Filter = {}

    let juez1 = [];
    let juez2 = [];
    let juez3 = [];
    let juez4 = [];


    let juez1Filter_dos = {}
    let juez2Filter_dos = {}
    let juez3Filter_dos = {}
    let juez4Filter_dos = {}

    let juez1_dos = [];
    let juez2_dos = [];
    let juez3_dos = [];
    let juez4_dos = [];


    let puntuacionFinal = 0
    let puntuacionFinal_dos = 0
    let landings = []  
    let landings_dos = []  

    let puntuacionLanding = 0
    let puntuacionLanding_dos = 0
    let skills = ['s1','s2']
    let puntuacionesTemporales = []
    let puntuacionesTemporales_dos = []
    let sumaEjecucion = 0
    let sumaEjecucion_dos = 0
    let toScore = 0
    let toScore_dos = 0
    

    if(dataName.split(' ')[0] === 'BASE' || dataName.split(' - ')[0] === 'ELITE C DMT MASCULINO'){



      juez1Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 1)[0] || {}
      juez2Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 2)[0] || {}

      juez1Filter_dos = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 1)[1] || {}
      juez2Filter_dos = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 2)[1] || {}

  
      juez1 = Object.values(juez1Filter.score ?? {}) || [];
      juez2 = Object.values(juez2Filter.score ?? {}) || [];

      juez1_dos = Object.values(juez1Filter_dos.score ?? {}) || [];
      juez2_dos = Object.values(juez2Filter_dos.score ?? {}) || [];


    
    
      landings = [juez1[2],juez2[2]]    
      puntuacionLanding = landings.reduce((a, b) => a + b, 0)
      
      landings_dos = [juez1_dos[2],juez1_dos[2]]    
      puntuacionLanding_dos = landings_dos.reduce((a, b) => a + b, 0)


    
      for(let i = 0 ; i <= numeroSkills-1 ; i++){
          let data = [juez1[i],juez2[i]];   
    
          puntuacionesTemporales.push(data.reduce((a, b) => a + b, 0))
          //puntuacionesTemporales.push(obj)  
      }


      for(let i = 0 ; i <= numeroSkills_dos-1 ; i++){
        let data = [juez1_dos[i],juez2_dos[i]];   
  
        puntuacionesTemporales_dos.push(data.reduce((a, b) => a + b, 0))
        //puntuacionesTemporales.push(obj)  
    }
      
      sumaEjecucion = puntuacionesTemporales.reduce((a, b) => a + b, 0)+puntuacionLanding
      sumaEjecucion_dos = puntuacionesTemporales_dos.reduce((a, b) => a + b, 0)+puntuacionLanding_dos
    
      

      if(numeroSkills === 2){
        toScore = 20
      }
      if(numeroSkills === 1){
        toScore = 18
      }


      if(numeroSkills_dos === 2){
        toScore_dos = 20
      }
      if(numeroSkills_dos === 1){
        toScore_dos = 18
      }

      putuacionTotalEjecucion = toScore-(sumaEjecucion/10)
      putuacionTotalEjecucion_dos = toScore_dos-(sumaEjecucion_dos/10)

  
      puntuacionFinal = (putuacionTotalEjecucion+dificultad)-penalizacion
      puntuacionFinal_dos= (putuacionTotalEjecucion_dos+dificultad_dos)-penalizacion_dos

      puntuacionFinal = puntuacionFinal + puntuacionFinal_dos



    }
    else{

    juez1Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 1)[0] || {}
    juez2Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 2)[0] || {}
    juez3Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 3)[0] || {}
    juez4Filter = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 4)[0] || {}

    juez1Filter_dos = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 1)[1] || {}
    juez2Filter_dos = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 2)[2] || {}
    juez3Filter_dos = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 3)[3] || {}
    juez4Filter_dos = scores.filter(score => score.tipe === 'ejecucion' && score.juez == 4)[1] || {}

    juez1 = Object.values(juez1Filter.score ?? {}) || [];
    juez2 = Object.values(juez2Filter.score ?? {}) || [];
    juez3 = Object.values(juez3Filter.score ?? {}) || [];
    juez4 = Object.values(juez4Filter.score ?? {}) || [];


    juez1_dos = Object.values(juez1Filter.score ?? {}) || [];
    juez2_dos = Object.values(juez2Filter.score ?? {}) || [];
    juez3_dos = Object.values(juez3Filter.score ?? {}) || [];
    juez4_dos = Object.values(juez4Filter.score ?? {}) || [];


  
    landings = [juez1[2],juez2[2],juez3[2],juez4[2]]
    landings =  landings.sort((a, b) => a - b);

    landings_dos = [juez1_dos[2],juez2_dos[2],juez3_dos[2],juez4_dos[2]]
    landings_dos =  landings.sort((a, b) => a - b);

  
    if (landings.length > 2) {
        landings.splice(0, 1); // Eliminar el mínimo
        landings.splice(-1, 1); // Eliminar el máximo
    }    

    if (landings_dos.length > 2) {
      landings_dos.splice(0, 1); // Eliminar el mínimo
      landings_dos.splice(-1, 1); // Eliminar el máximo
  }  
  
    puntuacionLanding = landings.reduce((a, b) => a + b, 0)
    puntuacionLanding_dos = landings_dos.reduce((a, b) => a + b, 0)

    puntuacionesTemporales = []
  
    for(let i = 0 ; i <= numeroSkills-1 ; i++){
        let data = [juez1[i],juez2[i],juez3[i],juez4[i]];
  
        data =  data.sort((a, b) => a - b);
  
        if (data.length > 2) {
            data.splice(0, 1); // Eliminar el mínimo
            data.splice(-1, 1); // Eliminar el máximo
        }
  
      
        puntuacionesTemporales.push(data.reduce((a, b) => a + b, 0))
        //puntuacionesTemporales.push(obj)  
    }

    puntuacionesTemporales_dos = []
  
    for(let i = 0 ; i <= numeroSkills_dos-1 ; i++){
        let data = [juez1_dos[i],juez2_dos[i],juez3_dos[i],juez4_dos[i]];
  
        data =  data.sort((a, b) => a - b);
  
        if (data.length > 2) {
            data.splice(0, 1); // Eliminar el mínimo
            data.splice(-1, 1); // Eliminar el máximo
        }
  
      
        puntuacionesTemporales_dos.push(data.reduce((a, b) => a + b, 0))
        //puntuacionesTemporales.push(obj)  
    }

    
    sumaEjecucion = puntuacionesTemporales.reduce((a, b) => a + b, 0)+puntuacionLanding
    sumaEjecucion_dos = puntuacionesTemporales_dos.reduce((a, b) => a + b, 0)+puntuacionLanding_dos
  
    if(numeroSkills === 2){
      toScore = 20
    }
    if(numeroSkills === 1){
      toScore = 18
    }

    if(numeroSkills_dos === 2){
      toScore_dos = 20
    }
    if(numeroSkills_dos === 1){
      toScore_dos = 18
    }


    putuacionTotalEjecucion = toScore-(sumaEjecucion/10)
    putuacionTotalEjecucion_dos = toScore_dos-(sumaEjecucion_dos/10)

    puntuacionFinal = ( putuacionTotalEjecucion + dificultad)-penalizacion
    puntuacionFinal_dos = ( putuacionTotalEjecucion_dos + dificultad_dos)-penalizacion_dos

    puntuacionFinal = puntuacionFinal + puntuacionFinal_dos
  }
        
    
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

        let puntuacionTotal = calcularRankingTram(scores,item.name);
      
        if (isNaN(puntuacionTotal)) {
          puntuacionTotal = 0
      }

        puntuacionTotal = puntuacionTotal.toFixed(2)
        
        const logo = logos.filter(logo => atleta.club === logo.name)[0]?.logo || 'default.png'
        ranking[`${atleta.firstName} ${atleta.lastName}, ${atleta.name}||(${atleta.club})||${atleta.gender}||${logo}||${item.name}||${createSlug(item.name)}`] = puntuacionTotal;
    });
  })

  // Ordenamos el ranking por puntuación
  const rankingOrdenado = Object.entries(ranking).sort((a, b) => b[1] - a[1]);
 return rankingOrdenado;
}



//router.get('/:sport/:gender/:category', async (req, res) => {
  router.get('/:sport', async (req, res) => {
    const sport = req.params.sport;
    // const gender = req.params.gender;
    // const category = req.params.category;
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


function createSlug(text) {
  return text
      .toLowerCase() // Convierte a minúsculas
      .trim() // Elimina espacios al principio y al final
      .replace(/[\s_]+/g, '-') // Reemplaza espacios y guiones bajos con guiones
      .replace(/[^\w\-]+/g, '') // Elimina caracteres no alfanuméricos excepto guiones
      .replace(/\-\-+/g, '-'); // Reemplaza múltiples guiones consecutivos con uno solo
}



module.exports = router;
