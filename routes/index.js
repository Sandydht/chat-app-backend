const express = require('express');
const router = express.Router();

const authController = require('~/controllers/authController');
const responseController = require('~/controllers/responseController');
const userController = require('~/controllers/userController');
const chatRoomController = require('~/controllers/chatRoomController');
const chatMessageController = require('~/controllers/chatMessageController');

router.use('/auth', authController);
router.use('/response', responseController);
router.use('/user', userController);
router.use('/chat-room', chatRoomController);
router.use('/chat-message', chatMessageController);

module.exports = router;
