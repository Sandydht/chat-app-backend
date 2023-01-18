const express = require('express');
const router = express.Router();

const authController = require('~/controllers/authController');
const responseController = require('~/controllers/responseController');
const contactController = require('~/controllers/contactController');

router.use('/auth', authController);
router.use('/response', responseController);
router.use('/contact', contactController);

module.exports = router;
