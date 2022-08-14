const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const chatroomsController = require('../controllers/chatrooms')

router.route('/:chatPageID')
    .get(catchAsync(chatroomsController.takeContentRoom))
    .post(catchAsync(chatroomsController.storeRoomContent))

router.route('/:chatPageID/resetnewmess')
    .post(catchAsync(chatroomsController.resetNewMess))
module.exports = router