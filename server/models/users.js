const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

const Room = require('./rooms')
const friendSchema = new Schema({
    username:String,
    roomID:String,
    online:{type:Boolean,default:false},
    newMess:{type:Number, default: 0}
},{_id:false})
const UserSchema = new Schema({
    friends:[friendSchema],
    addFriendsSent:[],
    addFriendsReceive:[]
})

UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User',UserSchema)