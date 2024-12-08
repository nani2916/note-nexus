const express = require('express');
const { signup, signin, add_note } = require('../controllers/userController');
const router = express.Router();

router.route('/register').post(signup);
router.route('/login').post(signin);
router.route('/add-note').post(add_note);
router.route('/view-notes').get(view_notes);
router.route('/note/:noteid').get(view_note_by_id);

module.exports = router;
