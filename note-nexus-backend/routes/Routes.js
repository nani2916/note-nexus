const express = require('express');
const { signup, signin } = require('../controllers/userController');
const router = express.Router();

router.route('/register').post(signup);
router.route('/login').post(signin);

module.exports = router;
