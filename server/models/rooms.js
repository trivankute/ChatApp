const mongoose = require('mongoose');
const Schema = mongoose.Schema
const contentSchema = new Schema({
    input:String,
    username:String,
    time:String
},{_id:false})
const RoomSchema = new Schema({
    content:[contentSchema]
})

module.exports = mongoose.model('Room',RoomSchema)