const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// const asyncHandler = 'express-async-handler';
const userCtrl = require('../controllers/user.controller');

router.route('/').get((userCtrl.get));

router.route('/').post((userCtrl.create));

router.route('/:userId').put(auth, (userCtrl.update));

router.route('/:userId').get((userCtrl.getUserById));

module.exports = router;