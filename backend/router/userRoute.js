const express = require('express');

const router = express.Router();
const { register, category, search, profile } = require('../controllers/userController');
const wrapAsync = require('../utils/wrapAsync');

// Prefix - /api/user/

router.post('/register', wrapAsync(register));
router.get('/category', wrapAsync(category));
router.post('/search', wrapAsync(search));
router.get('/profile/:userId', wrapAsync(profile));

module.exports = router;
