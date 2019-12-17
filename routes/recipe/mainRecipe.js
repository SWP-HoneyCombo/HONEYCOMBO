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

router.get('/search/:TAG', function(req, res) {
    var itemListTag = req.params.TAG
    var itemList = itemListTag.split('-')
    itemList.shift() // remove ' '
    var recipeTitleList = []
    var noneDupRecipeTitle;
    var lastRecipeTitle = []
    var recipeTagData = {};

    // make searching query
    var searchRecipe = 'select TITLE from recipe where '
    for(var i = 0; i < itemList.length; i++) {
        searchRecipe = searchRecipe + 'TAGCONTENTS LIKE "%' + itemList[i] + '%" OR '
    }

    // cutting last three character : OR' '
    var searchRecipeQuery = searchRecipe.substr(0, searchRecipe.length - 3)
    console.log('search recipe title query = ' + searchRecipeQuery)

    var itemQuery = function(callback) {
        conn.query(searchRecipeQuery, function(err, rows, fields) {
            if(err) {
                console.log('tag query db err')
            }
            if(rows.length) {
                for(var j = 0; j < rows.length; j++) {
                    recipeTitleList.push(rows[j].TITLE)
                }
                // 중복 타이틀 제거
                noneDupRecipeTitle = new Set(recipeTitleList)
                lastRecipeTitle = Array.from(noneDupRecipeTitle)
            }else {
                lastRecipeTitle = [""]
            }

            console.log("recipe title list without duplication = " + lastRecipeTitle)
            console.log(lastRecipeTitle)

            var recipeQuery = function(callback) {
                var selectRecipe = 'select IMGFILENAME, TAGCONTENTS, TITLE, USERID, TOTALPRICE from recipe where TITLE in (?)'
                conn.query(selectRecipe, [lastRecipeTitle], function(err, rows2, fields) {
                    if(err) {
                        console.log('selectRecipeQuery db err')
                        throw err;
                    }
                    if(rows2.length) {
                        recipeTagData.items = rows2;
                    }else {
                        recipeTagData.items = ""
                    }
                    console.log("searched data using tag = ")
                    console.log(recipeTagData)
                    res.json(recipeTagData)
                })
                callback(null, recipeTagData)
            }
            recipeQuery(function(err, recipeTagData) {
                if(err) {
                    console.log("select recipe query err")
                }else {
                    console.log('second callback here')
                }
            })
        })
    }
    itemQuery(function(err, recipeTagData) {
        if(err) {
            console.log("item query callback db err")
        }else {
            console.log("first call back here")
        }
    })
})

module.exports = router;