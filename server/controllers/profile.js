const User = require('../models/users')
const Room = require('../models/rooms')
const findFriend = async (req,res,next) => {
    if(req.query!=={} && req.query.friendname!=="")
    {
        const {profileID} = req.params
        const {friendname} = req.query
        const regularExpress = new RegExp('^' + friendname)
        let friends = await User.find({username:{$in:regularExpress}})
        const user = await User.findById(profileID)
        const userFriends = user.friends.map(item=>item.username)
        if(friends.length>0)
        {
            friends = friends.filter((item)=>{
                // *ko phan biet dc 2 object = nhau
                // *let compare = JSON.parse(JSON.stringify(item)) !== item
                if(item.username!==user.username && !userFriends.includes(item.username))
                    return item
                }
            )
            res.json({state:"success",friends:friends})
        }
        else
            res.json({state:"fail",message:"Can't find a friend starts with that name"})
    }
    else
    {
        let err = {state:'fail',message:""}
        err.message = "Please type your friend's name first"
        next(err)
    }
}

const addFriend = async (req,res) => {
    const {profileID} = req.params
    const {friendName} = req.body
    const user = await User.findById(profileID)
    const friend = await User.findOne({username:friendName})
    if(!user.addFriendsSent.includes(friendName))
    {
        user.addFriendsSent.push(friendName)
        friend.addFriendsReceive.push(user.username)
    }
    await user.save()
    await friend.save()
    res.json({state:'success',user:user})
    // const room = await new Room({content:[]})
    // const {username1, username2} = req.body
    // const user = await User.findOne({username:username1})
    // const user1 = await User.findOne({username:username2})
    // user.friends.push({username:user1.username,roomID:room._id})
    // user1.friends.push({username:user.username,roomID:room._id})
    // await user.save()
    // await user1.save()
    // await room.save()
    // res.json({state:'success',user:user})
}

const rejectAddFriend = async (req,res) => {
    const {profileID} = req.params
    const {friendName} = req.body
    const user = await User.findById(profileID)
    const friend = await User.findOne({username:friendName})
    user.addFriendsReceive =  user.addFriendsReceive.filter((item)=>item!==friendName)
    friend.addFriendsSent = friend.addFriendsSent.filter((item)=>item!==user.username)
    await user.save()
    await friend.save()
    res.json({state:'success',user:user})
}

const acceptFriend = async (req,res) => {
    const room = await new Room({content:[]})
    const {username1, username2} = req.body
    const user = await User.findOne({username:username1})
    const user1 = await User.findOne({username:username2})
    user.friends.push({username:user1.username,roomID:room._id})
    user1.friends.push({username:user.username,roomID:room._id})

    user.addFriendsReceive = user.addFriendsReceive.filter((item)=>item!==username2)
    user1.addFriendsSent = user1.addFriendsSent.filter((item)=>item!==username1)

    await user.save()
    await user1.save()
    await room.save()
    res.json({state:'success',user:user})
}

const deleteFriend = async(req,res) => {
    const {username,roomID} = req.body
    const {profileID} = req.params
    const user = await User.findById(profileID)
    const fen = await User.findOne({username:username})
    await Room.deleteOne({'_id':roomID})
    user.friends = user.friends.filter(item=>{
        if(item.username!==fen.username)
        return item
    })
    fen.friends = fen.friends.filter(item=>{
        if(item.username!==user.username)
        return item
    })
    
    await user.save()
    await fen.save()
    res.json({state:'success',user:user})
}

module.exports = {
    findFriend
    ,
    addFriend
    ,
    acceptFriend
    ,
    rejectAddFriend
    ,
    deleteFriend
}