var express = require("express")
var app = express()
var path = require('path')
var bodyParser = require("body-parser")
var router = require('./routes/index')

var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var flash = require('connect-flash')

// passport setting before router, secret = random!
app.use(session({
    secret: 'keyboard cat',
    // cookie: { maxAge: 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// add static file path
app.use(express.static('public'))
app.use(express.static('routes'))
app.use(express.static('views'))
app.use(express.static('public/images'))
app.use(express.static('public/css'))
app.use(express.static('public/src'))
app.use(express.static('public/src/css'))

// for get POST request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true})) // if not json// format
app.set('view engine', 'ejs')

// start server
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env)
});

app.use(router)
