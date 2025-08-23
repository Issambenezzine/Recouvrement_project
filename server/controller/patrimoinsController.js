const Debiteur_Patrimoine = require("../models/Debiteur_Patrimoine")


const getPatrimoinsCadrage = async(req,res) => {
    try {
        const {debiteurId, marche} = req.body
        const patrimoins = await Debiteur_Patrimoine.findAll({where:{debiteurId,marche}})
        return res.status(200).send(patrimoins)
    }catch(err) {
        console.log(err.message)
        return res.status(500).send("Error fetching patrimoins : ",err.message)
    }
}

module.exports = {getPatrimoinsCadrage}