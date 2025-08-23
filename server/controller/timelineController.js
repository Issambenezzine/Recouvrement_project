const Timeline = require("../models/Timeline.js")

const getTimeline = async(req,res)=>{
    try {
        const {dossierId} = req.body
        console.log("dossierId: ",dossierId)
        const timeline = await Timeline.findAll({where:{dossierId:dossierId}})
        res.status(200).json(timeline)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

module.exports = {
    getTimeline
}