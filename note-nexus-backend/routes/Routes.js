const express = require('express');
const { signup, signin, add_note } = require('../controllers/userController');
const router = express.Router();

router.route('/register').post(signup);
router.route('/login').post(signin);
router.route('/add-note').post(add_note);


module.exports = router;
