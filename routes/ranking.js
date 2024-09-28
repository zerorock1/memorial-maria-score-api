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
  


router.get('/:sport', async (req, res) => {
    const sport = req.params.sport;
    const db = req.db;
    
    try {

        const rondas = await db.collection('rondas').find({ sport: sport }).toArray();
        const rankings = calculateRankings(sport,rondas);
        console.log(rondas)
        res.status(200).send(rankings);
      } catch (error) {
        res.status(400).send({
          message: 'Error al calcular clasificación',
          error: error.message
        });
      }
});



module.exports = router;
