const mapper = (data) =>
  data.map((item) => ({
    N_dossier: item["N°Dossier"],
    categorie: item["Catégorie"],
    capital: item["Capital"],
    creance: item["Créance"],
    intRetard: item["IntRetard"],
    Autres_frais: item["Autres frais"],
    total: item["Total"],
    duree: item["Durée"],
    mensualite: item["Mensualité"],
    date_premiere_echeance: item["Date Première Échéance"],
    date_derniere_echeance: item["Date Dernière Échéance"],
    date_Contentieux: item["Date Contentieux"],
    type_PI: item["Type PI"],
    debiteur_CIN: item["Débiteur N°CIN"],
    debiteur: item["Débiteur"],
    debiteur_date_naissance: item["Débiteur Date Naissance"],
    debiteur_profession: item["Débiteur Profession"],
    debiteur_adresse: item["Débiteur Adresse"],
    debiteur_ville: item["Débiteur Ville"],
    debiteur_tel1: item["Débiteur N°Tél 1"],
    debiteur_tel2: item["Débiteur N°Tél 2"],
    employeur: item["Employeur"],
    employeur_adresse: item["Employeur Adresse"],
    employeur_ville: item["Employeur Ville"],
    employeur_tel1: item["Employeur N°Tél 1"],
    employeur_tel2: item["Employeur N°Tél 2"],
    cautionneur_CIN: item["Cautionneur N°CIN"],
    cautionneur: item["Cautionneur"],
    cautionneur_adresse: item["Cautionneur Adresse"],
    cautionneur_ville: item["Cautionneur Ville"],
    cautionneur_tel1: item["Cautionneur N°Tél 1"],
    cautionneur_tel2: item["Cautionneur N°Tél 2"],
    conjoint_CIN: item["Conjoint N°CIN"],
    conjoint_nom: item["Conjoint Nom"],
    conjoint_adresse: item["Conjoint Adresse"],
    conjoint_ville: item["Conjoint Ville"],
    conjoint_tel1: item["Conjoint N°Tél 1"],
    conjoint_tel2: item["Conjoint N°Tél 2"],
    ID_Gestionnaire: item["ID Gestionnaire"],
    commentaire_gestionnaire: item["Commentaire gestionnaire"],
    commentaire_responsable: item["Commentaire responsable"],
    autre: item["Autre"],
  }));

const mapCadrageAddresse = (data) =>
  data.map((item) => ({
    CIN: item["CIN"],
    nom: item["NOM"],
    adresse: item["ADRESSE"],
    ville: item["VILLE"],
  }));

const mapCadrageTel = (data) =>
  data.map((item) => ({
    radical: item["Radical"],
    CIN: item["CIN"],
    nom: item["Nom Prenom"],
    Tel1: item["Tel 1"],
    Tel2: item["Tel 2"],
    Tel3: item["Tel 3"],
  }));

const mapCadrageBanque = (data) =>
  data.map((item) => ({
    nom: item["NOM ET PRENOM"],
    debiteurId: item["CIN"],
    solde: item["solde"],
    Tel_Domicile: item["Tel Domicile"],
    RIB: item["RIB"],
    Date: item["DATE"],
    Date_mouvement: item["DATE MOUVEMENT"],
  }));

const mapCadragePatrimoins = (data) =>
  data.map((item) => ({
    debiteurId: item["Cin"],
    ville: item["Ville"],
    titre: item["Titre"],
    NBRE_TF: item["NBRE TF"],
    Nom: item["Nom"],
    NomF: item["NomF"],
    H: item["H"],
    Are: item["Are"],
    CA: item["CA"],
    Quote: item["Quote"],
    Part: item["Part"],
    Pdite: item["Pdite"],
    AdrProp: item["AdrProp"],
    Consistance: item["Consistance"],
  }));

const mapCadrageEmployeur = (data) =>
  data.map((item) => ({
    RS: item["RS"],
    AVT: item["AVT"],
    AD_STE: item["AD STE"],
    V_STE: item["V STE"],
    NUM_SAL: item["NUM SAL"],
    NM: item["NM"],
    AD_SAL: item["AD SAL"],
    V_SAL: item["V SAL"],
    PR: item["PR"],
    PRD: item["PRD"],
    JR: item["JR"],
    SLR: item["SLR"],
    ML: item["ML"],
    TL: item["TL"],
    debiteurId: item["CIN_CLIENT"],
  }));

module.exports = {
  mapper,
  mapCadrageEmployeur,
  mapCadrageAddresse,
  mapCadrageBanque,
  mapCadrageTel,
  mapCadragePatrimoins,
};
