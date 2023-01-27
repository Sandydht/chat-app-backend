const express = require('express');
const router = express.Router();

const authController = require('~/controllers/authController');
const responseController = require('~/controllers/responseController');
const userController = require('~/controllers/userController');
const contactController = require('~/controllers/contactController');

router.use('/auth', authController);
router.use('/response', responseController);
router.use('/user', userController);
router.use('/contact', contactController);

module.exports = router;
