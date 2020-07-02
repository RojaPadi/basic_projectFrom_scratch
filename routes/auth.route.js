const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.route('/login').post((authCtrl.login));

module.exports = router;