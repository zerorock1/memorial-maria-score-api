const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv'); // Importamos json2csv

// Ruta para exportar participantes a CSV
router.get('/export-csv-xxxx-abra-cadabra', async (req, res) => {
  try {
    const db = req.db;  // Obtén la instancia de la base de datos de MongoDB
    const participants = await db.collection('participantes').find().toArray(); // Obtener los datos

    // Verificar si existen datos
    if (!participants || participants.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron participantes',
      });
    }

    // Define los campos que quieres exportar
    const fields = ['tipo', 'club', 'clubPhone', 'email', 'license', 'name', 'firstName', 'lastName', 'category', 'gender', 'sport', 'createdAt'];
    
    // Utiliza json2csv para convertir los datos a CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(participants);

    // Establece las cabeceras para la respuesta CSV
    res.header('Content-Type', 'text/csv');
    res.attachment('participantes.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: 'Error al exportar participantes',
      error: error.message,  // opcional: puedes incluir detalles del error
    });
  }
});


router.get('/export-csv-grupos-competicion', async (req, res) => {
  try {
    const db = req.db;  // Obtén la instancia de la base de datos de MongoDB
    const participants = await db.collection('rondas').find().toArray(); // Obtener los datos
    // Verificar si existen datos
    if (!participants || participants.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron participantes',
      });
    }

    
    const allgrupos = []; // Inicializa un array vacío para almacenar los nombres de los miembros

    participants.forEach(participant => {
      participant.members.forEach(member => {
        allgrupos.push({
          grupo: participant.name, // Nombre del grupo
          nombre: member.name, // Nombre del miembro
          apellido1: member.firstName || null, // Apellido1 (puede ser null)
          club: member.club || null // Club (puede ser null)
        });
      });
    });

    // Define los campos que quieres exportar
    const fields = ['grupo','nombre','apellido1','club'];
    
    // Utiliza json2csv para convertir los datos a CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(allgrupos);

    // Establece las cabeceras para la respuesta CSV
    res.header('Content-Type', 'text/csv; charset=utf-8');
    const date = new Date();
    res.attachment('grupos_'+date.toISOString()+'.csv');
    res.send(Buffer.from(csv, 'utf8'));
  } catch (error) {
    res.status(500).json({
      message: 'Error al exportar participantes',
      error: error.message,  // opcional: puedes incluir detalles del error
    });
  }
});


router.get('/export-csv-equipos-sincro', async (req, res) => {
  try {
    const db = req.db;  // Obtén la instancia de la base de datos de MongoDB
    const participants = await db.collection('teams').find().toArray(); // Obtener los datos
    // Verificar si existen datos
    if (!participants || participants.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron participantes',
      });
    }

    
    const allgrupos = []; // Inicializa un array vacío para almacenar los nombres de los miembros

    participants.forEach(participant => {
      participant.members.forEach(member => {
        allgrupos.push({
          equipo: participant.name, // Nombre del grupo
          nombre: member.name, // Nombre del miembro
          apellido1: member.firstName || null, // Apellido1 (puede ser null)
          club: member.club || null // Club (puede ser null)
        });
      });
    });

    // Define los campos que quieres exportar
    const fields = ['equipo','nombre','apellido1','club'];
    
    // Utiliza json2csv para convertir los datos a CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(allgrupos);

    // Establece las cabeceras para la respuesta CSV
    res.header('Content-Type', 'text/csv; charset=utf-8');
    const date = new Date();
    res.attachment('equipos_sincro_'+date.toISOString()+'.csv');
    res.send(Buffer.from(csv, 'utf8'));
  } catch (error) {
    res.status(500).json({
      message: 'Error al exportar participantes',
      error: error.message,  // opcional: puedes incluir detalles del error
    });
  }
});

module.exports = router;
