var express = require('express')
var router = express.Router()
var path = require('path')

// if change for server version, use dbConfig.remoteOption
var mysql = require('mysql')
var dbConfig = require(path.join(__dirname, '../dbConnect')).dbConfig.localOption
var conn = mysql.createConnection(dbConfig)

router.get('/', function (req, res) {
    var id = req.user
    var productList = {}

    if (!id) {
        productList.isLoggedin = false;
    } else {
        productList.isLoggedin = true;
        productList.userID = id;
    }

    // rendering view with query result - format : json
    var queryList = [];
    var defaultQuery = function (callback) {
        conn.query('SELECT * FROM product', function (err, res, fields) {
            if (err) return callback(err);
            if (res.length) {
                for (var i = 0; i < res.length; i++) {
                    queryList.push(res[i]);
                }
                productList.items = queryList
            } else {
                productList.items = ""
                console.log('none query result')
            }
            callback(null, productList);
        });
    };
    // callback query result for ejs rendering
    defaultQuery(function (err, productList) {
        if (err) console.log("show product page Database error!");
        else {
            // console.log(resultProduct.itemData)
            res.render('productView/productMain.ejs', productList)
        }
    });
})


// item search for item name
router.get('/search/:ITEMNAME', function (req, res) {
    var ITEMNAME = req.params.ITEMNAME
    var productList = {}
    var query = conn.query('select * from product where ITEMNAME LIKE "%' + ITEMNAME + '%"', function (err, rows) {
        if (err) throw err;
        if (rows[0]) {
            productList.result = 1;
            productList.items = rows;
        } else {
            productList.result = 0
        }
        res.json(productList)
    })
})

// item sorting by company name
router.get('/classify/:COMPANY', function (req, res) {
    var COMPANY = req.params.COMPANY
    var productByCompany = {}
    var query = conn.query('select * from product where COMPANY = ? order by REGISTRATIONDATE DESC', [COMPANY], function (err, rows) {
        if (err) throw err;
        if (rows[0]) {
            productByCompany.result = 1;
            productByCompany.items = rows;
        } else {
            productByCompany.result = 0
        }
        res.json(productByCompany)
    })
})
module.exports = router;