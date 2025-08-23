const Debiteur_Banque = require("../models/Debiteur_Banque")


const getBanques = async(req,res) => {
    try {
        const {debiteurId, marche} = req.body
        const banques = await Debiteur_Banque.findAll({where:{debiteurId,marche}});
        res.status(200).json(banques);
    }catch(err) {
        console.log("Error in get Banques : ",err.message)
        return res.status(500).json(err);
    }
}


module.exports = {getBanques}
