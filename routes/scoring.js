const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');



router.post('/routineresult', async (req, res) => {
   

    try {
      const db = req.db;


      let usuario;
      let config;
      let obj;


      if(req.body.type === 'individual'){
        config = await db.collection('config_gimnasta').findOne({ sport: 'trp' })
        obj = {
          'config':config,
          'sensor':req.body.individualResult
        }
        
      }
      else{
        config = await db.collection('config_gimnasta').findOne({ sport: 'sin' })
        obj = {
          'config':config,
          'sensor':req.body.synchronizedResult
        }
        
      }
      
      const result = await db.collection('sensores').insertOne(obj);
      
      
  
      res.status(201).json({
        message: 'Se ha creado un nuevo registro',
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error al crear el registro',
        error: error.message,  // opcional: puedes incluir detalles del error
      });
    }
  });



module.exports = router;
