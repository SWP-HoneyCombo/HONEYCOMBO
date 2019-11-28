var express = require('express')
var router = express.Router();
// 상대경로 사용
var path = require('path')
var mysql = require('mysql')

var remoteOption = {
    host: 'hostname',
    user: 'username',
    port: 'portnum',
    password: 'password',
    database: 'databasename',
    multipleStatements: true
}

var localOption = {
    host: 'localhost',
    port: '3306',
    user: 'honeycombo',
    password: 'honeycombo123',
    database: 'honeycombo',
    multipleStatements: true
}

var dbConfig = {
    'remoteOption': remoteOption,
    'localOption': localOption
}
module.exports = router;
module.exports.dbConfig = dbConfig;