var express = require('express')
var app = express()
var router = express.Router()
var mysql = require('mysql')
var path = require('path')

var signup = require('./auth/signup')
var login = require('./auth/login')
var logout = require('./auth/logout')
var dropout = require('./auth/dropout')
var product = require('./product/main')
var mainRecipe = require('./recipe/mainRecipe')
var detailRecipe = require('./recipe/detailRecipe')
var writeRecipe = require('./recipe/writeRecipe')

// if change for server version, use dbConfig.remoteOption
var dbConfig = require('./dbConnect').dbConfig.localOption
var conn = mysql.createConnection(dbConfig)
var passport = require('passport')

router.use('/', product)
router.use('/product/main', product)
router.use('/recipe/mainRecipe', mainRecipe)
router.use('/recipe/detailRecipe', detailRecipe)
router.use('/recipe/writeRecipe', writeRecipe)
router.use('/auth/signup', signup)
router.use('/auth/login', login)
router.use('/auth/logout', logout)
router.use('/auth/dropout', dropout)


module.exports = router;