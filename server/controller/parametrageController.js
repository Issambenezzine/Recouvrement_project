const Status = require("../models/Status.js");
const Lot = require("../models/Lot.js");
const Action = require("../models/Action.js");
const Client = require("../models/Client.js");
const connection = require("../config/db.js");
const FamilleAction = require("../models/FamilleAction.js")
const TypeReglement = require("../models/TypeReglement.js")
const ModeReglement = require("../models/ModeReglement.js")
const Sort = require("../models/Sort.js")
const ListeAction = require("../models/ListeAction.js")



///////////////////////////    STATUS    ///////////////////////////////

const getStatus = async (req, res) => {
  try {
    const status = await Status.findAll();
    return res.status(200).send(status);
  } catch (err) {
    return res.status(500).send(`Error fetching status: ${err.message}`);
  }
};

const changeVisibilityStatus = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
  }
  try {
    const { id } = req.body;
    await Status.update(
      { visibility: connection.literal("1 - visibility") },
      { where: { id } }
    );
    return res.status(201).send("Visibility is changed successfully !");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error changing visibility: ${err.message}`);
  }
};

const addStatus = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { option } = req.body;
  try {
    await Status.create({
      statusValue: option,
      visibility: 1,
    });
    return res
      .status(200)
      .json({ message: `Statut ${option} a été ajouté avec succès` });
  } catch (err) {
    return res.status(500).send(`Error saving status: ${err.message}`);
  }
};

const deleteStatus = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    const { id } = req.body;
    await Status.destroy({
      where: { id:id }
    });
    return res
      .status(200)
      .json({ message: `Statut a été supprimé avec succès !` });
  } catch (err) {
    console.log(err.message)
    return res.status(500).send(`Error deleting status: ${err.message}`);
  }
};

///////////////////////////    LOT    ///////////////////////////////

const getLot = async (req, res) => {
  try {
    const lots = await Lot.findAll();
    return res.status(200).send(lots);
  } catch (err) {
    return res.status(500).send(`Error fetching lots: ${err.message}`);
  }
};


const changeVisibilityLot = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
  }
  try {
    const { id } = req.body;
    await Lot.update(
      { visibility: connection.literal("1 - visibility") },
      { where: { id } }
    );
    return res.status(201).send("Visibility is changed successfully !");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error changing visibility: ${err.message}`);
  }
};


const addLot = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { option } = req.body;
  try {
    await Lot.create({
      Nlot: option,
      visibility: 1,
    });
    return res.status(200).json({ message: `Lot ${option} a été ajouté avec succès` });
  } catch (err) {
    return res.status(500).send(`Error saving lot: ${err.message}`);
  }
};

const deleteLot = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { id } = req.body;
  try {
    await Lot.destroy({
      where: { id },
    });
    return res.status(200).json({ message: `Lot a été supprimé avec succès !` });
  } catch (err) {
    return res.status(500).send(`Error deleting lot: ${err.message}`);
  }
};

///////////////////////////    ACTION    ///////////////////////////////

const getAction = async (req, res) => {
  try {
    const actions = await ListeAction.findAll();
    return res.status(200).send(actions);
  } catch (err) {
    return res.status(500).send(`Error fetching Actions : ${err.message}`);
  }
};

const getActionByFamille = async (req, res) => {
  try {
    const familleId  = req.params.familleId;
    const actions = await ListeAction.findAll({
      where: { familleId: familleId },
    });
    return res.status(200).send(actions);
  }catch(err) {
    return res.status(500).send(`Error fetching Actions : ${err.message}`);
  }
}

const changeVisibilityAction = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
  }
  try {
    const { id } = req.body;
    await ListeAction.update(
      { visibility: connection.literal("1 - visibility") },
      { where: { id } }
    );
    return res.status(201).send("Visibility is changed successfully !");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error changing visibility: ${err.message}`);
  }
};

const addAction = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { option, famille } = req.body;
  try {
    await ListeAction.create({
      nomAction: option,
      familleId: famille,
      visibility: 1,
    });
    return res.status(200).json({ message: `Action ${option} a été ajouté avec succès !` });
  } catch (err) {
    console.log(err.message)
    return res.status(500).send(`Error saving Action : ${err.message}`);
  }
};

const deleteAction = async (req, res) => {
  const role = req.role;
  const { id } = req.body;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    await ListeAction.destroy({
      where: { id:id },
    });
    return res.status(200).json({ message: `Action a été supprimé avec succès !` });
  } catch (err) {
    return res.status(500).send(`Error deleting Action : ${err.message}`);
  }
};

///////////////////////////    CLIENT    ///////////////////////////////
const getClient = async (req, res) => {
  try {
    const clients = await Client.findAll();
    return res.status(200).send(clients);
  } catch (err) {
    return res.status(500).send(`Error fetching Clients : ${err.message}`);
  }
};

const changeVisibilityClient = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
  }
  try {
    const { id } = req.body;
    await Client.update(
      { visibility: connection.literal("1 - visibility") },
      { where: { id } }
    );
    return res.status(201).send("Visibility is changed successfully !");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error changing visibility: ${err.message}`);
  }
};


const addClient = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { option, commiss } = req.body;
  try {
    await Client.create({
      marche: option,
      commissione: commiss,
      visibility: 1,
    });
    return res.status(200).json({message:`Marché ${option} a été ajouté avec succès`});
  } catch (err) {
    return res.status(500).send(`Error saving Client : ${err.message}`);
  }
};

const deleteClient = async (req, res) => {
  const role = req.role;
  const { id } = req.body;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    await Client.destroy({
      where: { id },
    });
    return res.status(200).json({ message: `Marché a été supprimé avec succès !` });
  } catch (err) {
    return res.status(500).send(`Error deleting Client : ${err.message}`);
  }
};

//////////////////////////////////////// FAMILLES D'ACTIONS ///////////////////////////////////////////////


const getFamilleAction = async (req, res) => {
  try {
    const actions = await FamilleAction.findAll();
    return res.status(200).send(actions);
  } catch (err) {
    return res.status(500).send(`Error fetching Famille Actions : ${err.message}`);
  }
};


const changeVisibilityFamilleAction = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
  }
  try {
    const { id } = req.body;
    await FamilleAction.update(
      { visibility: connection.literal("1 - visibility") },
      { where: { id } }
    );
    return res.status(201).send("Visibility is changed successfully !");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error changing visibility: ${err.message}`);
  }
};

const addFamilleAction = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { option } = req.body;
  try {
    await FamilleAction.create({
      familleAction: option,
      visibility: 1,
    });
    return res.status(200).json({message:`Famille d'actions ${option} a été ajouté avec succès`});
  } catch (err) {
    return res.status(500).send(`Error saving Action : ${err.message}`);
  }
};

const deleteFamilleAction = async (req, res) => {
  const role = req.role;
  const { id } = req.body;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    await FamilleAction.destroy({
      where: { id:id },
    });
    return res.status(200).json({ message: `Famille d'action a été supprimé avec succès !` });
  } catch (err) {
    return res.status(500).send(`Error deleting Action : ${err.message}`);
  }
};

/////////////////////////////////////////// Type De Reglement /////////////////////////////////////////////

const getTypeReglement = async (req, res) => {
  try {
    const typeReglements = await TypeReglement.findAll();
    return res.status(200).send(typeReglements);
  } catch (err) {
    return res.status(500).send(`Error fetching Type Reglements : ${err.message}`);
  }
}


const changeVisibilityTypeReglement = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
  }
  try {
    const { id } = req.body;
    await TypeReglement.update(
      { visibility: connection.literal("1 - visibility") },
      { where: { id } }
    );
    return res.status(201).send("Visibility is changed successfully !");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error changing visibility: ${err.message}`);
  }
};


const addTypeReglement = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { option } = req.body;
  try {
    await TypeReglement.create({
      typeReg: option,
      visibility: 1,
    });
    return res.status(200).json({message:`Type de règlement ${option} a été ajouté avec succès`});
  } catch (err) {
    return res.status(500).send(`Error saving Action : ${err.message}`);
  }
};


const deleteTypeReglement = async (req, res) => {
  const role = req.role;
  const { id } = req.body;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    await TypeReglement.destroy({
      where: { id:id },
    });
    return res.status(200).json({ message: `Type de règlement a été supprimé avec succès !` });
  } catch (err) {
    return res.status(500).send(`Error deleting Action : ${err.message}`);
  }
};



/////////////////////////////////////////// Mode De Reglement /////////////////////////////////////////////

const getModeReglement = async (req, res) => {
  try {
    const modeReglements = await ModeReglement.findAll();
    return res.status(200).send(modeReglements);
  } catch (err) {
    return res.status(500).send(`Error fetching Mode Reglements : ${err.message}`);
  }
}


const changeVisibilityModeReglement = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
  }
  try {
    const { id } = req.body;
    await ModeReglement.update(
      { visibility: connection.literal("1 - visibility") },
      { where: { id } }
    );
    return res.status(201).send("Visibility is changed successfully !");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error changing visibility: ${err.message}`);
  }
};


const addModeReglement = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { option } = req.body;
  try {
    await ModeReglement.create({
      modeReg: option,
      visibility: 1,
    });
    return res.status(200).json({message:`Mode de règlement ${option} a été ajouté avec succès`});
  } catch (err) {
    return res.status(500).send(`Error saving Action : ${err.message}`);
  }
};


const deleteModeReglement = async (req, res) => {
  const role = req.role;
  const { id } = req.body;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    await ModeReglement.destroy({
      where: { id:id },
    });
    return res.status(200).json({ message: `Mode de règlement a été supprimé avec succès !` });
  } catch (err) {
    return res.status(500).send(`Error deleting Mode de règlement : ${err.message}`);
  }
};


/////////////////////////////////////////// SORT /////////////////////////////////////////////

const getSort = async (req, res) => {
  try {
    const sorts = await Sort.findAll();
    return res.status(200).send(sorts);
  } catch (err) {
    return res.status(500).send(`Error fetching Mode Reglements : ${err.message}`);
  }
}


const changeVisibilitySort = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
  }
  try {
    const { id } = req.body;
    await Sort.update(
      { visibility: connection.literal("1 - visibility") },
      { where: { id } }
    );
    return res.status(201).send("Visibility is changed successfully !");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(`Error changing visibility: ${err.message}`);
  }
};


const addSort = async (req, res) => {
  const role = req.role;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  const { option } = req.body;
  try {
    await Sort.create({
      sortValue: option,
      visibility: 1,
    });
    return res.status(200).json({message:`Sort ${option} a été ajouté avec succès`});
  } catch (err) {
    return res.status(500).send(`Error saving Action : ${err.message}`);
  }
};


const deleteSort = async (req, res) => {
  const role = req.role;
  const { id } = req.body;
  if (role !== "ADMIN") {
    return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
  }
  try {
    await Sort.destroy({
      where: { id:id },
    });
    return res.status(200).json({ message: `Sort a été supprimé avec succès !` });
  } catch (err) {
    return res.status(500).send(`Error deleting Sorts : ${err.message}`);
  }
};

module.exports = {
  addStatus,
  deleteStatus,
  getStatus,
  getLot,
  addLot,
  deleteLot,
  addAction,
  getAction,
  deleteAction,
  getClient,
  deleteClient,
  addClient,
  changeVisibilityStatus,
  changeVisibilityClient,
  changeVisibilityLot,
  getFamilleAction,
  changeVisibilityFamilleAction,
  addFamilleAction,
  deleteFamilleAction,
  getTypeReglement,
  changeVisibilityTypeReglement,
  addTypeReglement,
  deleteTypeReglement,
  addModeReglement,
  deleteModeReglement,
  changeVisibilityModeReglement,
  getModeReglement,
  addSort,
  deleteSort,
  getSort,
  changeVisibilitySort,
  changeVisibilityAction,
  getActionByFamille
};
