const cron = require('node-cron');
const { checkIfDossierShouldBeTreatedToday } = require('../controller/dossierController.js');


cron.schedule('0 1 * * *', async (req,res) => {
  console.log('Running scheduled task at 23:00');
  try {
    await checkIfDossierShouldBeTreatedToday(req,res);
  } catch (err) {
    console.error("Scheduled task error:", err.message);
  }
});