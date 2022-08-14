const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const userController = require('../controllers/users')

router.route('/register')
    .post(catchAsync(userController.forRegister))

router.route('/login')
    .post(passport.authenticate('local'),catchAsync(userController.forLogin))

router.route('/logout')
    .get(userController.forLogout)

module.exports = router