const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const profileControllers = require('../controllers/profile')

router.route('/:profileID')
    .get(catchAsync(profileControllers.findFriend))

router.route('/:profileID/addfriend')
    .post(catchAsync(profileControllers.addFriend))

router.route('/:profileID/acceptfriend')
    .post(catchAsync(profileControllers.acceptFriend))

router.route('/:profileID/rejectaddfriend')
    .post(catchAsync(profileControllers.rejectAddFriend))

router.route('/:profileID/deletefriend')
    .post(catchAsync(profileControllers.deleteFriend))

module.exports = router