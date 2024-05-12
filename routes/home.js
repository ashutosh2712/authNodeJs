var express = require('express');
var router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
/* GET home page. */
router.get('/', authenticateUser, (req, res) => {
    res.status(200).render('home');
});

module.exports = router;
