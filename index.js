const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());

const corsOptions = {
  //origin: 'https://www.memorialmariahg.org',
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));

app.use(express.json());

const mongoUri = process.env.MONGODB_URI;


const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

// Define your routes
const InscripcionRoutes = require('./routes/inscripcion');
const ExportRoutes = require('./routes/export');
const TeamRoutes = require('./routes/team');
const ParticipantesRoutes = require('./routes/participante');
const RondasRoutes = require('./routes/ronda');
const RankingsRoutes = require('./routes/ranking');

// Middleware to pass db instance to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.get('/api/check', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

// Routes
app.use('/api/inscripciones', InscripcionRoutes);
app.use('/api/export', ExportRoutes);
app.use('/api/team', TeamRoutes);
app.use('/api/participante', ParticipantesRoutes);
app.use('/api/ronda', RondasRoutes);
app.use('/api/rankings', RankingsRoutes);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await client.connect();
    db = client.db("memorial"); // Replace with your actual database name
    console.log("Connected to MongoDB Atlas");

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

startServer();