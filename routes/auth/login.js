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
    console.log('get login page')
    var msg;
    var errMsg = req.flash('error')
    if (errMsg) {
        msg = errMsg
    }
    res.render('./log-sess/login.ejs', {'message': msg})
})

// serialize
passport.serializeUser(function (user, done) {
    console.log('passport session save : ', user.ID)
    done(null, user.ID)
})

// deserialize
passport.deserializeUser(function (id, done) {
    console.log('passport session get id : ', id)
    done(null, id)
})

// enroll strategy
passport.use('local-login', new LocalStrategy({
        usernameField: 'ID',
        passwordField: 'PW',
        passReqToCallback: true
    },
    function (req, ID, PW, done) {
        // authentication log-in
        var query = conn.query('select * from user where ID=?', [ID], function (err, rows) {
            if (err) {
                return done(err)
            }
            if (rows.length) {
                bcrypt.compare(PW, rows[0].PW, function (err, res) {
                    if (res) {
                        return done(null, {'ID': ID, 'sessid': rows[0].uid})
                    } else {
                        return done(null, false, {'message': 'Your password is incorrect'})
                    }
                })
            } else {
                return done(null, false, {'message': 'Your Login info is not found'})
            }
        })
    }
))

router.post('/', function (req, res, next) {
    console.log("custom callback")
    passport.authenticate('local-login', function (err, user, info) {
        if (err) {
            res.status(500).json(err)
        }
        if (!user) {
            return res.status(401).json(info.message)
        }

        req.login(user, function (err) {
            if (err) {
                return next(err)
            }
            return res.json(user)
        })
    })(req, res, next)
})

module.exports = router;