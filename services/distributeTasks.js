const distributeDossiers = (mappedDossiers, employees) => {
    // Initialize workload for each employee
    const employeeLoad = employees.map(emp => ({
        ...emp,
        dossiers: [],
        totalCreance: 0
    }));

    // Sort dossiers by creance descending (biggest first)
    const sortedDossiers = [...mappedDossiers].sort((a, b) => b.creance - a.creance);

    // Assign each dossier to the least-loaded employee
    for (const dossier of sortedDossiers) {
        // Find employee with smallest workload
        employeeLoad.sort((a, b) => {
            if (a.totalCreance === b.totalCreance) {
                return a.dossiers.length - b.dossiers.length;
            }
            return a.totalCreance - b.totalCreance;
        });

        const employee = employeeLoad[0];
        employee.dossiers.push(dossier);
        employee.totalCreance += parseFloat(dossier.creance || 0); 
        dossier.ID_Gestionnaire = employee.id; 
    }

    return employeeLoad;
};
module.exports = {distributeDossiers}