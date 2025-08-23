const express = require("express");
const route = express.Router();
const {
  addStatus,
  deleteStatus,
  getStatus,
  getLot,
  addLot,
  deleteLot,
  getAction,
  addAction,
  deleteAction,
  addClient,
  deleteClient,
  getClient,
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
  getModeReglement,
  changeVisibilityModeReglement,
  addModeReglement,
  deleteModeReglement,
  getSort,
  changeVisibilitySort,
  addSort,
  deleteSort,
  changeVisibilityAction,
  getActionByFamille,
} = require("../controller/parametrageController.js");
const { authorize } = require("../middlewares/auth.js");

route.get("/status", authorize, getStatus);
route.post("/status/save", authorize, addStatus);
route.delete("/status/delete", authorize, deleteStatus);
route.post("/status/visibility",authorize,changeVisibilityStatus)

route.get("/lots", authorize, getLot);
route.post("/lots/save", authorize, addLot);
route.delete("/lots/delete", authorize, deleteLot);
route.post("/lots/visibility",authorize, changeVisibilityLot)

route.get("/actions", authorize, getAction);
route.get("/actions/famille/:familleId",authorize,getActionByFamille)
route.post("/actions/save",authorize,addAction);
route.delete("/actions/delete",authorize,deleteAction);
route.post("/actions/visibility",authorize,changeVisibilityAction)

route.get("/clients", authorize, getClient);
route.post("/clients/save", authorize, addClient);
route.delete("/clients/delete", authorize, deleteClient);
route.post("/clients/visibility",authorize,changeVisibilityClient)


route.get("/famille", authorize, getFamilleAction);
route.post("/famille/visibility",authorize,changeVisibilityFamilleAction)
route.delete("/famille/delete", authorize, deleteFamilleAction);
route.post("/famille/save", authorize, addFamilleAction);


route.get("/typereg", authorize, getTypeReglement);
route.post("/typereg/visibility",authorize,changeVisibilityTypeReglement)
route.post("/typereg/save", authorize, addTypeReglement);
route.delete("/typereg/delete", authorize, deleteTypeReglement);


route.get("/modereg", authorize, getModeReglement);
route.post("/modereg/visibility",authorize,changeVisibilityModeReglement)
route.post("/modereg/save", authorize, addModeReglement);
route.delete("/modereg/delete", authorize, deleteModeReglement);

route.get("/sorts", authorize, getSort);
route.post("/sorts/visibility",authorize,changeVisibilitySort)
route.post("/sorts/save", authorize, addSort);
route.delete("/sorts/delete", authorize, deleteSort);

module.exports = route;
