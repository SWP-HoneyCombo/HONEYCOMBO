var express = require('express')
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var dbOption = require(path.join(__dirname, '../dbConnect')).dbConfig.localOption
var conn = mysql.createConnection(dbOption)

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require('connect-flash')
var bcrypt = require('bcrypt-nodejs')

router.get('/', (req, res) => {
    console.log('signup page')
    var msg
    var errMsg = req.flash('error')
    if (errMsg) {
        msg = errMsg
    }
    res.render('./log-sess/signup.ejs', {'message': msg})
})

// serialize
passport.serializeUser(function (user, done) {
    console.log('passport session save : ', user.ID)
    done(null, user.ID)
})

// deserialize
passport.deserializeUser(function (id, done) {
    // console.log('passport session get id : ', id)
    done(null, id)
})

// enroll strategy
passport.use('local-join', new LocalStrategy({
    usernameField: 'ID',
    passwordField: 'PW',
    passReqToCallback: true
}, function (req, ID, PW, done) {
    var query = conn.query('select * from user where ID=?', [ID], function (err, rows) {
        if (err) {
            return done(err)
        }
        if (rows.length) {
            console.log('existed user err msg')
            return done(null, false, {'message': 'your ID is already used'})
        } else {
            bcrypt.hash(PW, null, null, function (err, hash) {
                var sql = {ID: ID, PW: hash}
                var query = conn.query('insert into user set ?', sql, function (err, rows) {
                    if (err) throw err;
                    return done(null, {'ID': ID, 'tempID': rows.insertId.toString()})
                })
            })
        }
    })
}))

router.post('/', passport.authenticate('local-join', {
    successRedirect: '/product/main',
    failureRedirect: '/auth/signup',
    failureFlash: true
}))
module.exports = router;