const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const mongoUri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function getRondas(sport) {
  const teams = await db.collection('rondas').find({ sport: sport }).toArray();
  return teams;
}

function processTrp(rondas) {
  rondas.forEach(ronda => {
    const puntuaciones = []; // Move this inside the loop to reset for each ronda
    ronda.members.forEach(member => {
      let newScoreEntryEjecucion = {};
      for (let i = 1; i <= 4; i++) {
        newScoreEntryEjecucion = {
          _id: new ObjectId(),
          tipe: 'ejecucion',
          gimnasta: member,
          score: fakeEjecucionTrampolin(),
          verified: true,
          salto: null,
          juez: i,
          date: new Date(),
        };
        puntuaciones.push(newScoreEntryEjecucion);
      }

      const newScoreEntryDificultad = {
        _id: new ObjectId(),
        tipe: 'dificultad',
        gimnasta: member,
        score: fakeDificultadTrampolin(),
        verified: true,
        salto: null,
        juez: 1,
        date: new Date(),
      };
      puntuaciones.push(newScoreEntryDificultad);

      const newScoreEntryVuelo = {
        _id: new ObjectId(),
        tipe: 'vuelo',
        gimnasta: member,
        score: fakeVueloTrampolin(),
        verified: true,
        salto: null,
        juez: 1,
        date: new Date(),
      };
      puntuaciones.push(newScoreEntryVuelo);

      const newScoreEntryPenalizacion = {
        _id: new ObjectId(),
        tipe: 'penalizacion',
        gimnasta: member,
        score: fakePenalizacionTrampolin(),
        verified: true,
        salto: null,
        juez: 1,
        date: new Date(),
      };
      puntuaciones.push(newScoreEntryPenalizacion); // Add Penalizacion score


      const newScoreEntryNskills = {
        _id: new ObjectId(),
        tipe: 'nsaltos',
        gimnasta: member,
        score: fakeNumSkills(),
        verified: true,
        salto: null,
        juez: 1,
        date: new Date(),
      };
      puntuaciones.push(newScoreEntryNskills); // Add Penalizacion score
    });

    // Insert scores in DB for each ronda
    saveScore(puntuaciones, ronda._id);
  });
}

function processDmt(rondas) {
  rondas.forEach(ronda => {
    const puntuaciones = []; // Move this inside the loop to reset for each ronda
    ronda.members.forEach(member => {
        for(let salto = 1 ; salto <= 2 ; salto++){
          let newScoreEntryEjecucion = {};
          for (let i = 1; i <= 4; i++) {
            newScoreEntryEjecucion = {
              _id: new ObjectId(),
              tipe: 'ejecucion',
              gimnasta: member,
              score: fakeEjecucionMiniTrump(),
              verified: true,
              salto: salto,
              juez: i,
              date: new Date(),
            };
            puntuaciones.push(newScoreEntryEjecucion);
          }
    
          const newScoreEntryDificultad = {
            _id: new ObjectId(),
            tipe: 'dificultad',
            gimnasta: member,
            score: fakeDificultadTrampolin(),
            verified: true,
            salto: salto,
            juez: 1,
            date: new Date(),
          };
          puntuaciones.push(newScoreEntryDificultad);
    
          const newScoreEntryVuelo = {
            _id: new ObjectId(),
            tipe: 'vuelo',
            gimnasta: member,
            score: fakeVueloTrampolin(),
            verified: true,
            salto: salto,
            juez: 1,
            date: new Date(),
          };
          puntuaciones.push(newScoreEntryVuelo);
    
          const newScoreEntryPenalizacion = {
            _id: new ObjectId(),
            tipe: 'penalizacion',
            gimnasta: member,
            score: fakePenalizacionTrampolin(),
            verified: true,
            salto: salto,
            juez: 1,
            date: new Date(),
          };
          puntuaciones.push(newScoreEntryPenalizacion); // Add Penalizacion score
        }
    });

    // Insert scores in DB for each ronda
    saveScore(puntuaciones, ronda._id);
  });
}




async function saveScore(scores, id) {
  const result = await db.collection('rondas').updateOne(
    { _id: new ObjectId(id) }, // Filter by ID
    {
      $set: {
        scores: scores, // Replace the entire "scores" field with the new scores
      }
    }
  );

  console.log("Scores inserted for ID:" + id); // Improved console log to show the ronda ID
}



function fakeEjecucionTrampolin() {
  const allowedValuesSkills = [1, 2, 3, 4, 5, -1]; // -1 es NP
  const allowedValuesLanding = [1,2,3,4,5,10]; // -1 es NP
 

    let obj = {
      'S1':shuffleArray(allowedValuesSkills)[0],
      'S2':shuffleArray(allowedValuesSkills)[0],
      'S3':shuffleArray(allowedValuesSkills)[0],
      'S4':shuffleArray(allowedValuesSkills)[0],
      'S5':shuffleArray(allowedValuesSkills)[0],
      'S6':shuffleArray(allowedValuesSkills)[0],
      'S7':shuffleArray(allowedValuesSkills)[0],
      'S8':shuffleArray(allowedValuesSkills)[0],
      'S9':shuffleArray(allowedValuesSkills)[0],
      'S10':shuffleArray(allowedValuesSkills)[0],
      'L':shuffleArray(allowedValuesLanding)[0]
    }


  return obj;
}


function fakeEjecucionMiniTrump() {
  const allowedValuesSkills = [1, 2, 3, 4, 5, -1]; // -1 es NP
  const allowedValuesLanding = [1,2,3,4,5,10]; // -1 es NP
 

    let obj = {
      'S1':shuffleArray(allowedValuesSkills)[0],
      'S2':shuffleArray(allowedValuesSkills)[0],
      'L':shuffleArray(allowedValuesLanding)[0]
    }


  return obj;
}


function fakeVueloTrampolin() {
  return { "desp_hori": parseFloat(randRange(0, 10)), "vuelo": parseFloat(randRange(0, 10)) };
}

function fakeDificultadTrampolin() {
  return parseFloat(randRange(0, 10));
}

function fakePenalizacionTrampolin() {
  return parseFloat(randRange(0, 10));
}

function fakeNumSkills() {
  return Math.round(randRange(0, 10));
}





// Helper functions
function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const startServer = async () => {
  try {
    await client.connect();
    db = client.db("memorial"); // Replace with your actual database name
    console.log("Connected to MongoDB");

    console.log('Creating fake scores...');

    const rondasTrp = await getRondas('trp');
    processTrp(rondasTrp,'trp');

    const rondasDmt = await getRondas('dmt');
    processDmt(rondasDmt,'dmt');

    const rondasSin = await getRondas('sin');
    processTrp(rondasSin,'sin');



  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

startServer();
