const Action = require("../models/Action");
const connection = require("../config/db.js");
const Gestionnaire = require("../models/Gestionnaire.js");

const punchStatistics = async () => {
  try {
    const nombreTotalInterventions = await Action.count();
    const nombreGestionnaire = await Gestionnaire.count();
    const [objectifs] = await connection.query(`
          SELECT * from objectifs  
      `);

    const [encaissement] = await connection.query(`
     SELECT 
    g.id,
    g.username,
    e.montant,
    e.createdAt
FROM gestionnaire g
LEFT JOIN dossier d 
    ON d.gestionnaireId = g.id
LEFT JOIN enaissement e 
    ON d.id = e.dossierId
WHERE e.id IS NOT NULL 
   OR NOT EXISTS (
        SELECT 1 
        FROM dossier d2
        LEFT JOIN enaissement e2 ON d2.id = e2.dossierId
        WHERE d2.gestionnaireId = g.id
   );

      `);
    const [rowsTotalCreance] = await connection.query(`
      SELECT SUM(creance) AS total 
      FROM prc.creance 
      INNER JOIN prc.dossier ON creance.id = dossier.creanceId
      WHERE etatResponsable != 'Nouvelles actions'
        AND etat != 'Nouvelles actions'
        AND etatResponsable != 'Actions en backlog'
        AND etat != 'Actions en backlog'
        AND etat != 'Action à traiter'
        AND etatResponsable != 'Action à traiter'
    `);

    const [rowTotalRetardCreance] = await connection.query(`SELECT SUM(creance) AS total 
      FROM prc.creance 
      INNER JOIN prc.dossier ON creance.id = dossier.creanceId
      WHERE etatResponsable = 'Nouvelles actions'
        || etat = 'Nouvelles actions'
        || etatResponsable = 'Actions en backlog'
        || etat = 'Actions en backlog'`);

    const [graphCommissione] = await connection.query(`
        SELECT montant, commissione, enaissement.createdAt
from enaissement
LEFT JOIN dossier ON dossier.id = enaissement.dossierId
INNER JOIN client ON client.id = dossier.clientId
      `);
    const TotalCreanceEncours = rowsTotalCreance[0].total || 0;
    const TotalCreanceRetard = rowTotalRetardCreance[0].total || 0;
    const [encaissGestionnaire] =
      await connection.query(`SELECT 
    gestionnaire.id, 
    gestionnaire.username, 
    sub.createdAt,
    sub.montant AS montant_total,
    sub.montant * (sub.commissione / 100) AS Commission
FROM gestionnaire
LEFT JOIN (
    SELECT dossier.gestionnaireId, enaissement.createdAt, enaissement.montant, enaissement.id AS en_id, client.commissione
    FROM dossier
    INNER JOIN enaissement ON dossier.id = enaissement.dossierId
    LEFT JOIN client ON dossier.clientId = client.id
) sub ON sub.gestionnaireId = gestionnaire.id
WHERE sub.en_id IS NOT NULL
   OR NOT EXISTS (
       SELECT 1 
       FROM dossier
       INNER JOIN enaissement ON dossier.id = enaissement.dossierId
       WHERE dossier.gestionnaireId = gestionnaire.id
   );`);
    const [rowsMontant] = await connection.query(`
      SELECT SUM(montant) AS montantEncaiss 
      FROM prc.enaissement
    `);
    const montantEncaisse = rowsMontant[0].montantEncaiss || 0;
    const [years] =
      await connection.query(`SELECT DISTINCT YEAR(createdAt) AS year
                              FROM enaissement
                              ORDER BY year DESC;`);

    return {
      years,
      nombreTotalInterventions,
      TotalCreanceEncours,
      TotalCreanceRetard,
      objectifs,
      encaissement,
      graphCommissione,
      encaissGestionnaire,
      montantEncaisse,
      moyTrait:
        nombreGestionnaire > 0
          ? nombreTotalInterventions / nombreGestionnaire
          : 0,
      taux:
        TotalCreanceEncours > 0
          ? (montantEncaisse / TotalCreanceEncours) * 100
          : 0,
    };
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { punchStatistics };
