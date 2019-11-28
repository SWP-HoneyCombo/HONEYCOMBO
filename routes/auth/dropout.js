var express = require('express')
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var dbOption = require(path.join(__dirname, '../dbConnect')).dbConfig.localOption
var conn = mysql.createConnection(dbOption)
var bcrypt = require('bcrypt-nodejs')

router.get('/', function (req, res) {
    res.render('./log-sess/dropOut.ejs')
})

router.post('/dropUser', function (req, res) {
    var userID = req.user
    var uncheckedPW = req.body.inputPW

    var checkPW = function (callback) {
        var checkResult = {}
        var checkQuery = 'select PW from USER where ID = ?'

        conn.query(checkQuery, [userID], function (err, rows, fields) {
            bcrypt.compare(uncheckedPW, rows[0].PW, function (err, res) {
                if (res) {
                    checkResult.result = 1
                    checkResult.successMsg = '탈퇴 처리되었습니다.'
                    req.logout()
                    var deleteQuery = 'delete from user where ID = ?'
                    conn.query(deleteQuery, [userID], function (err, rows, fields) {
                        if (err) throw err
                        if (rows) console.log(fields)
                    })
                } else {
                    checkResult.result = 0
                    checkResult.errMsg = '패스워드가 일치하지 않습니다.'
                }
                callback(null, checkResult)
            })
        })
    }
    checkPW(function (err, checkResult) {
        if (err) {
            console.log('check db err')
        } else {
            console.log('alert drop out status message to client')
            res.json(checkResult)
        }
    })
})

module.exports = router;