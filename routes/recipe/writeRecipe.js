var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    var id = req.user
    if (!id) res.render('log-sess/login.ejs')
    else {
        res.render('recipeView/writeRecipe.ejs', {'logged': true, 'ID': id})
    }
})

module.exports = router;