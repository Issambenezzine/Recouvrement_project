const cron = require('node-cron');
const { checkIfDossierIsBacklog } = require('../controller/dossierController.js');


// Run every day at 23:00 (11:00 PM)
cron.schedule('16 23 * * *', async (req,res) => {
  console.log('Running scheduled task at 23:00');
  try {
    console.log("checkIfDossierIsBacklog is triggered !!")
    await checkIfDossierIsBacklog();
  } catch (err) {
    console.error("Scheduled task error:", err.message);
  }
});
