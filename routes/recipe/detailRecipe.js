var express = require('express')
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
// if change for server version, use dbCo
// config.remoteOption
var dbConfig = require(path.join(__dirname, '../dbConnect')).dbConfig.localOption
var conn = mysql.createConnection(dbConfig)

var async = require('async')

// rendering view with query result - format : json
router.get('/viewDetail/:TITLE', function (req, res) {
    var id = req.user
    var recipeDetailData = {}

    if (!id) {
        recipeDetailData.isLoggedin = false;
    } else {
        recipeDetailData.isLoggedin = true;
        recipeDetailData.userID = id;
    }
    var title = req.params.TITLE

    var queryList = [];
    var productList = []

    var recipeQuery = 'select IMGFILENAME as imgPath, TITLE as title, USERID as writerID, TOTALPRICE as totalPrice, ' +
        'TOTALTIME as totalTime, DIFFICULTY as difficulty, VIDEOURL as videoUrl, content1, content2, content3, content4, content5 ' + //CONTENTS as recipeContents ' +
        'from recipe where TITLE ="' + title + '";'
    var commentQuery = 'select comment.USERID as userId, COMMENTCONTENTS as commentContents, RATE as rate ' +
        'from comment inner join recipe on comment.RECIPETITLE=recipe.TITLE where TITLE="' + title + '";'
    var tagQuery = 'select TAGCONTENTS as productList from recipe where TITLE = "' + title + '";'
    var productQuery = 'select IMGFILENAME as imgPath, ITEMNAME as itemName, ITEMPRICE as itemPrice from product where ITEMNAME in (?)'

    async.waterfall([
            function (callback) { // get recipe, comment, tag
                console.log("first query execute")
                conn.query(recipeQuery + commentQuery + tagQuery, function (err, rows, fields) {
                    if (err) return callback(err)
                    if (rows.length) {
                        console.log("first query success")
                        var sumRate = 0;
                        var avgRate = 0;
                        var commentCnt = rows[1].length

                        if (commentCnt) {
                            for (var i = 0; i < rows[1].length; i++) {
                                sumRate += rows[1][i].rate;
                            }
                            avgRate = sumRate / rows[1].length;
                            recipeDetailData.avgRate = avgRate;
                        } else {
                            // avgRate = 0;
                            recipeDetailData.avgRate = "평점 미등록"
                        }

                        recipeDetailData.items = {};
                        recipeDetailData.items.recipeData = rows[0];
                        recipeDetailData.items.comment = rows[1];

                        productList = rows[2][0].productList.split('#')
                        productList.shift() // remove first value ' '

                        callback(null, productList, recipeDetailData);
                    } else {
                        callback(err);
                    }
                });
            },
            // productList에 있는 상품 정보를 불러온다.
            function (productList, recipeDetailData, callback) {
                console.log("second query execute")
                conn.query(productQuery, [productList], function (err, rows2, fields) {
                    if (err) return callback(err)
                    if (rows2.length) {
                        console.log("second query success")
                        for (var i = 0; i < rows2.length; i++) {
                            queryList.push(rows2[i]);
                        }
                        recipeDetailData.items.usedProduct = queryList
                    } else {
                        console.log("err")
                    }
                    // console.log("detail view data : ")
                    // console.log(recipeDetailData.items)
                    callback(null, recipeDetailData)
                });
            }
        ],
        function (err, recipeDetailData) {
            if (err) {
                console.log("DB err")
            } else {
                console.log("last query result = ")
                console.log(recipeDetailData)
                res.statusCode = 200
                res.render('recipeView/detailRecipe.ejs', recipeDetailData)
            }
        }
    );
})

router.post('/writeComment', function (req, res) {
    var recipeTitle = req.body.recipeTitle;
    var id = req.user
    var commentWrite = req.body.commentWrite
    var usersRate = parseInt(req.body.usersRate)
    var writeComment = {}

    if (!id) {
        res.statusCode = 401
        writeComment.result = 0;
        writeComment.errMsg = "댓글 작성은 로그인 후 이용 가능합니다."
        res.json(writeComment)
    } else {
        // 사용자가 이전에 댓글을 작성하지 않은 경우 댓글 작성 가능
        var checkQuery = function (callback) {
            var commentCheckQuery = 'select USERID from comment where USERID = ? and RECIPETITLE = ?';
            conn.query(commentCheckQuery, [id, recipeTitle], function (err, rows, fields) {
                if (err) return callback(err);
                if (rows.length) {
                    // 댓글이 있으면 에러메세지 띄워줘
                    res.statusCode = 403
                    writeComment.result = 0;
                    writeComment.errMsg = "이미 댓글을 등록했습니다."
                } else { // 댓글이 없으면 insert 후 전송
                    res.statusCode = 200
                    writeComment.result = 1
                    writeComment.userId = id
                    writeComment.contents = commentWrite
                    writeComment.rate = usersRate;

                    // insert comment data and update rating!
                    var insertQuery = 'INSERT INTO COMMENT (RECIPETITLE, USERID, COMMENTCONTENTS, RATE) values (?, ?, ?, ?)'
                    var params = [recipeTitle, id, commentWrite, usersRate]

                    conn.query(insertQuery, params, function (err, rows, fields) {
                        if (err) {
                            throw err;
                        }
                        if (rows) {
                            console.log(rows)
                        }
                    })
                }
                callback(null, writeComment);
            });
        };
        // callback query result for ejs rendering
        checkQuery(function (err, writeComment) {
            if (err) console.log("Database error!");
            else {
                res.json(writeComment)
            }
        });
    }
})

// comment edit request
router.get('/editComment/:title', function (req, res) {
    var title = req.params.title
    var id = req.user

    var editComment = {}
    var getComment = function (callback) {
        var pullQuery = 'select COMMENTCONTENTS as commentContents, RATE as rate from comment' +
            'where RECIPETITLE = ? and USERID = ?'
        conn.query(pullQuery, [title, id], function (err, rows, fields) {
            if (err) throw err;
            if (rows) {
                res.statusCode = 200
                editComment = rows;
            } else {
                res.statusCode = 204
                editComment = ""
            }
        })
        callback(null, editComment)
    }
    getComment(function (err, editComment) {
        if (err) console.log('editing comment err')
        else res.json(editComment)
    })
})

// update comment - click modify confirm btn
router.put('/updateComment/:title/:comment/:rate', function (req, res) {
    // UPDATE SQL!
    var id = req.user
    var title = req.params.title
    var editedComment = req.params.comment
    var editedRate = req.params.rate
    var updatedComment = {}

    var updateComment = function (callback) {
        var updateQuery = 'update comment set COMMENTCONTENTS = ? , RATE = ?' +
            'where RECIPETITLE = ? and USERID = ?'
        conn.query(updateQuery, [editedComment, editedRate, title, id], function (err, rows, fields) {
            if (err) throw err;
            if (rows.affectedRows > 0) {
                res.statusCode = 200
                updatedComment.result = 1
            } else {
                res.statusCode = 204
                updatedComment.result = 0
            }
        })
        callback(null, updatedComment)
    }
    updateComment(function (err, updatedComment) {
        if (err) console.log('editing comment err')
        else res.json(updatedComment)
    })
})

router.delete('/deleteComment/:title', function (req, res) {
    var id = req.user;
    var title = req.params.title;

    var deleteComment = {}
    var deleteSQL = 'delete from comment where RECIPETITLE = ? and USERID = ?'
    conn.query(deleteSQL, [title, id], function (err, rows, fields) {
        if (err) throw err;

        if (rows.affectedRows > 0) {
            res.statusCode = 200
            deleteComment.result = 1;
            deleteComment.successMsg = "Comment delete success!"
        } else {
            deleteComment.result = 0;
            deleteComment.errMsg = "Cannot delete this comment"
        }
        res.json(deleteComment)
    })
})

module.exports = router;