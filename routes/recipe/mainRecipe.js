var express = require('express')
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
// if change for server version, use dbConfig
// config.remoteOption
var dbConfig = require(path.join(__dirname, '../dbConnect')).dbConfig.localOption
var conn = mysql.createConnection(dbConfig)

router.get('/', function (req, res) {
    var id = req.user
    var recipeList = {}

    if (!id) {
        recipeList.isLoggedin = false;
    } else {
        recipeList.isLoggedin = true;
        recipeList.userID = id;
    }

    // rendering view with query result - format : json
    var queryList = [];
    var defaultQuery = function (callback) {
        var selectQuery = 'select TITLE, USERID, IMGFILENAME, TAGCONTENTS, TOTALPRICE from recipe';
        conn.query(selectQuery, function (err, rows, fields) {
            if (err) return callback(err);
            if (rows.length) {
                // console.log(rows)
                for (var i = 0; i < rows.length; i++) {
                    queryList.push(rows[i]);
                }
                recipeList.items = queryList
            } else {
                recipeList.items = ""
                console.log('none query result for recipe list showing')
            }
            callback(null, recipeList);
        });
    };
    // callback query result for ejs rendering
    console.log("default page rendering callback");
    defaultQuery(function (err, recipeList) {
        if (err) console.log("select query Database error!");
        else {
            res.render('recipeView/mainRecipe.ejs', recipeList)
        }
    });
})

router.post('/search', function (req, res) {
    var minPrice = req.body.minPrice
    var maxPrice = req.body.maxPrice
    console.log(req.body)

    var recipeList = {}
    var priceQuery = 'select TITLE, USERID, IMGFILENAME, TOTALPRICE, TAGCONTENTS from recipe where TOTALPRICE between ? and ?'
    var sqlValue = [minPrice, maxPrice]

    // console.log(priceQuery)
    var query = conn.query(priceQuery, sqlValue, function (err, rows) {
        if (err) throw err;
        if (rows) {
            recipeList.result = 1;
            recipeList.items = rows;
        } else {
            recipeList.result = 0
        }
        res.json(recipeList)
    })
})

module.exports = router;