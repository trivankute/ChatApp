const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/small-chat-app')
  .then(() => console.log("Connection to mongoDB opens"))
  .catch(error => handleError(error));
function handleError(error) {
    console.log(error)
}
const User = require('../models/users')
const Room = require('../models/rooms')

// add fen host of actions
// const seedTime= async ()=>{
//     const room = await new Room({content:[]})
//     const user = await User.findOne({username:"trivan"})
//     const user1 = await User.findOne({username:"trison"})
//     user.friends.push({username:user1.username,roomID:room._id})
//     user1.friends.push({username:user.username,roomID:room._id})
//     await user.save()
//     await user1.save()
//     await room.save()
//     // console.log(user,user1)

//     // list actions to register
//     // const user = await new User({username:"trivan"})
//     // const newUser = await User.register(user,"trivan")
//     // const user1 = await new User({username:"trison"})
//     // const newUser1 = await User.register(user1,"trison")
//     // const user2 = await new User({username:"triliem"})
//     // const newUser2 = await User.register(user2,"triliem")
// }

// send texts and store it  
const seedTime= async ()=>{
  const content = {input:"ditme trivan", username:"trison"}
  const user = await User.findOne({username:"trivan"})
  const user1 = await User.findOne({username:"trison"})
  const [roomID] = user.friends.map(item=>{ 
    if(item.username===user1.username) return item.roomID
  })
  // console.log(roomID)
  const room = await Room.findById(roomID)
  // console.log(room)
  room.content.push(content)
  // console.log(room)
  await user.save()
  await user1.save()
  await room.save()
  // console.log(user,user1)
}

seedTime()