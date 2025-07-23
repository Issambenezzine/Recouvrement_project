
const mapper = (data) => 
    data.map(item => ({
        N_dossier: item['N°Dossier'],
        categorie: item['Catégorie'],
        capital: item['Capital'],
        creance: item['Créance'],
        intRetard: item['IntRetard'],
        Autres_frais: item['Autres frais'],
        total: item['Total'],
        duree: item['Durée'],
        mensualite: item['Mensualité'],
        date_premiere_echeance: item['Date Première Échéance'],
        date_derniere_echeance: item['Date Dernière Échéance'],
        date_Contentieux: item['Date Contentieux'],
        type_PI: item['Type PI'],
        debiteur_CIN: item['Débiteur N°CIN'],
        debiteur: item['Débiteur'],
        debiteur_date_naissance : item['Débiteur Date Naissance'],
        debiteur_profession: item['Débiteur Profession'],
        debiteur_adresse: item['Débiteur Adresse'],
        debiteur_ville: item['Débiteur Ville'],
        debiteur_tel1: item['Débiteur N°Tél 1'],
        debiteur_tel2: item['Débiteur N°Tél 2'],
        employeur: item['Employeur'],
        employeur_adresse: item['Employeur Adresse'],
        employeur_ville: item['Employeur Ville'],
        employeur_tel1: item['Employeur N°Tél 1'],
        employeur_tel2: item['Employeur N°Tél 2'],
        cautionneur_CIN: item['Cautionneur N°CIN'],
        cautionneur: item['Cautionneur'],
        cautionneur_adresse: item['Cautionneur Adresse'],
        cautionneur_ville: item['Cautionneur Ville'],
        cautionneur_tel1: item['Cautionneur N°Tél 1'],
        cautionneur_tel2: item['Cautionneur N°Tél 2'],
        conjoint_CIN: item['Conjoint N°CIN'],
        conjoint_nom: item['Conjoint Nom'],
        conjoint_adresse: item['Conjoint Adresse'],
        conjoint_ville: item['Conjoint Ville'],
        conjoint_tel1: item['Conjoint N°Tél 1'],
        conjoint_tel2: item['Conjoint N°Tél 2'],
        ID_Gestionnaire: item['ID Gestionnaire'],
        commentaire_gestionnaire: item['Commentaire gestionnaire'],
        commentaire_responsable: item['Commentaire responsable'],
        autre: item['Autre']
    }));



const mapCadrageAddresse = (data) => {
     data.map(item => ({
        CIN: item['CIN'],
        nom: item['NOM'],
        adresse: item['ADRESSE'],
        ville: item['VILLE'],
    }))
}

const mapCadrageTel = (data) => {
     data.map(item => ({
        radical: item['Radical'],
        CIN: item['CIN'],
        nom: item['Nom Prenom'],
        Tel1: item['Tel1'],
        Tel2: item['Tel2'],
        Tel3: item['Tel3'],
    }))
}

const mapCadrageBanque = (data) => {
     data.map(item => ({
        nom: item['NOM ET PRENOM'],
        CIN: item['CIN'],
        nom: item['solde'],
        Tel: item['Tel Domicile'],
        RIB: item['RIB'],
        date: item['DATE'],
        date_mouvement: item['DATE MOUVEMENT'],
    }))
}


module.exports = { mapper };
