var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    req.logout()
    res.redirect('/product/main')
})
module.exports = router;