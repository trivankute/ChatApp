const User = require('../models/users')
const Room = require('../models/rooms')

const takeContentRoom = async (req,res,next)=>{
    try{
        const {chatPageID} = req.params
        const room = await Room.findById(chatPageID) 
        res.json({state:"success",room:room})
    }
    catch(err)
    {
        err.message="Can't find your room"
        next(err)
    }
}

const storeRoomContent = async(req,res,next) =>
{
    const {chatPageID} = req.params
    const {content,username,friendName} = req.body
    const fen = await User.findOne({username:friendName})
    fen.friends.forEach((item)=>{
        if(item.username===username)
        {
            item.newMess++
        }
    })
    const room = await Room.findById(chatPageID) 
    room.content.push(content)
    await room.save()
    await fen.save()
    res.json({state:'success'})
}

const resetNewMess = async(req,res,next) => {
    const {username, friendName} = req.body
    const user = await User.findOne({username:username})
    user.friends.forEach((item)=>{
        if(item.username===friendName)
        {
            item.newMess=0
        }
    })
    await user.save()
    res.json({state:"success",user:user})
}


module.exports = {
    takeContentRoom,
    storeRoomContent,
    resetNewMess
}